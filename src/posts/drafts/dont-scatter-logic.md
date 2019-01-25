---
title: Don't Scatter Logic All Over the Call Stack
date: 2019-01-08
category: tldr
---

[Read it](https://www.devjoy.com/blog/dont-scatter-logic-all-over-the-call-stack/) by [devjoy](https://www.devjoy.com/).

> There are two kinds of complexity and I don’t think students of programming are adequately taught to understand and handle the different kinds.

> The first kind of complexity is domain complexity, the problem at hand. The seemingly arbitrary business rules and edge cases that seem to keep popping up. … This sort of complexity shouldn’t be pushed down, it should be pulled out, highlighted.

> The other kind of complexity is implementation details. … These sorts of complexity should be pushed down, hidden, abstracted away so that the business logic stands out.

They converted this code example:
```static void Main(string[] args)
{
    PrintTradeBalance();
    Console.ReadKey();
}
```


To this structure instead to highlight the business rules:
```static void Main(string[] args)
{
    var transactions = GetTransactions();
    var cashMovements = GetCashMovements(transactions);
    var tradeBalances = GetTradeBalances(cashMovements);
    PrintTradeBalances(tradeBalances);
    Console.ReadKey();
}
```

