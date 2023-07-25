const AMM = artifacts.require("amm");
const Token1 = artifacts.require("Token1");
const Token2 = artifacts.require("Token2");

const AMOUNT_X = 500_000_000_000;
const AMOUNT_Y = 500_000_000_000;
const SWAP_X = 5_000_000_000;

contract("AMM", (accounts) => {
  let [alice, bob] = accounts;
  let ammInstance;
  let token_x;
  let token_y;
  let ammContract;

  before(async () => {
    ammInstance = await AMM.new();
    ammContract = ammInstance.address;

    token_x = await Token1.new({ from: alice });
    token_y = await Token2.new({ from: alice });

    await await token_x.transfer(bob, 6 * 10 ** 9);
    await token_y.transfer(bob, 1 * 10 ** 9);
    const bobXBalance = await token_x.balanceOf(bob);
    const bobXYBalance = await token_y.balanceOf(bob);
    console.log("Bob x balance ===>", bobXBalance.toString());
    console.log("Bob y balance ===>", bobXYBalance.toString());
  });

  it("should initialize new pool ", async () => {
    await token_x.approve(ammContract, AMOUNT_X, { from: alice });
    await token_y.approve(ammContract, AMOUNT_Y, { from: alice });

    await ammInstance.initializePool(
      token_x.address,
      token_y.address,
      AMOUNT_X,
      AMOUNT_Y,
      { from: alice }
    );
    const data = await ammInstance.getPool(1, { from: alice });
    const poolBalanceY = await token_y.balanceOf(ammContract);
    const poolBalanceX = await token_x.balanceOf(ammContract);

    console.log("result: ", data);
    console.log(
      "Pool's token Y balance after init : ",
      poolBalanceY.toString()
    );
    console.log("Pool's token X balance: ", poolBalanceX.toString());
  });

  it("should Bob swap token x to token y ", async () => {
    await token_x.approve(ammContract, AMOUNT_X, { from: bob });
    const bobX = await token_x.balanceOf(bob);
    const bobY = await token_y.balanceOf(bob);

    console.log("Bob x balance before ===>", bobX.toString());
    console.log("Bob y balance before ===>", bobY.toString());
    await ammInstance.swap(token_x.address, SWAP_X, 1, {
      from: bob,
    });
    const poolBalanceY = await token_y.balanceOf(ammContract);
    const poolBalanceX = await token_x.balanceOf(ammContract);
    const bobXBalance = await token_x.balanceOf(bob);
    const bobXYBalance = await token_y.balanceOf(bob);
    console.log("token_x.address: ", token_x.address);
    console.log("Pool's token Y balance : ", poolBalanceY.toString());
    console.log("Pool's token X balance: ", poolBalanceX.toString());
    console.log("======================//======================");
    console.log("Bob x balance after ===>", bobXBalance.toString());
    console.log("Bob y balance after ===>", bobXYBalance.toString());
  });
});
