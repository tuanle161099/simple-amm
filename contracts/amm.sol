// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AMM {
    struct Pool {
        address authority;
        IERC20 token_x;
        IERC20 token_y;
        uint amount_x;
        uint amount_y;
    }
    uint private poolIdx = 1;
    mapping(uint => Pool) private pools;

    // EventS
    event CreatePoolEvent(
        uint poolIdx,
        IERC20 token_x,
        IERC20 token_y,
        uint amount_x,
        uint amount_y,
        address authority
    );

    event SwapEvent(
        uint poolIdx,
        uint amount_x,
        uint amount_y,
        address authority
    );

    modifier isExistedPool(uint _poolIndex) {
        require(_poolIndex < poolIdx, "Pool not found");
        _;
    }

    modifier isValidToken(address _tokenIn, uint _poolIdx) {
        Pool memory pool = pools[_poolIdx];
        require(
            _tokenIn == address(pool.token_x) ||
                _tokenIn == address(pool.token_y),
            "Invalid token"
        );
        _;
    }

    function initializePool(
        IERC20 token_x,
        IERC20 token_y,
        uint amount_x,
        uint amount_y
    ) public {
        require(amount_x > 0 || amount_y > 0, "Invalid amount");
        /** Take current idx */
        uint poolId = poolIdx;

        Pool storage pool = pools[poolId];

        pool.amount_x = amount_x;
        pool.amount_y = amount_y;
        pool.token_x = token_x;
        pool.token_y = token_y;
        pool.authority = msg.sender;

        pool.token_x.transferFrom(msg.sender, address(this), amount_x);
        pool.token_y.transferFrom(msg.sender, address(this), amount_y);

        /** increase idx */
        poolIdx += 1;

        /** emit event */
        emit CreatePoolEvent(
            poolId,
            pool.token_x,
            pool.token_y,
            pool.amount_x,
            pool.amount_y,
            pool.authority
        );
    }

    function swap(
        address _tokenIn,
        uint _amountIn,
        uint256 _poolIdx
    ) public isExistedPool(_poolIdx) isValidToken(_tokenIn, _poolIdx) {
        Pool storage pool = pools[_poolIdx];
        bool isTokenX = _tokenIn == address(pool.token_x);
        uint amountIn = _amountIn;

        (IERC20 tokenIn, IERC20 tokenOut, uint resIn, uint resOut) = isTokenX
            ? (pool.token_x, pool.token_y, pool.amount_x, pool.amount_y)
            : (pool.token_y, pool.token_x, pool.amount_y, pool.amount_x);

        tokenIn.transferFrom(msg.sender, address(this), amountIn);
        // Transfer to user
        uint amountOut = resOut - ((resIn * resOut) / (resIn + amountIn));

        //Update pool
        (uint resX, uint resY) = isTokenX
            ? (resIn + amountIn, resOut - amountOut)
            : (resOut - amountOut, resIn + amountIn);

        pool.amount_x = resX;
        pool.amount_y = resY;

        emit SwapEvent(_poolIdx, amountIn, amountOut, address(msg.sender));
        tokenOut.transfer(msg.sender, amountOut);
    }

    function getPool(uint256 index) public view returns (Pool memory) {
        return pools[index];
    }
}

// interface IERC20 {
//     function totalSupply() external view returns (uint);

//     function balanceOf(address account) external view returns (uint);

//     function transfer(address recipient, uint amount) external returns (bool);

//     function allowance(
//         address owner,
//         address spender
//     ) external view returns (uint);

//     function approve(address spender, uint amount) external returns (bool);

//     function transferFrom(
//         address sender,
//         address recipient,
//         uint amount
//     ) external returns (bool);

//     event Transfer(address indexed from, address indexed to, uint amount);
//     event Approval(address indexed owner, address indexed spender, uint amount);
// }
