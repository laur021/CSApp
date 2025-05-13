using System;

namespace Application.DTOs;

public class Count
{
    public int EmailCount { get; set; }
    public int PhoneCount { get; set; }
    public int TotalTransactions { get; set; }
    public int TotalEmailCount { get; set; }
    public int TotalPhoneCount { get; set; }
}

public class UserCountSummaryDto : Count
{
    public string User { get; set; } = null!;

}

public class ProductSummaryDto : Count
{
    public string ProductName { get; set; } = null!;
}

public class DescriptionSummaryDto : Count
{
    public string DescriptionName { get; set; } = null!;

}

public class TransactionSummaryDto : Count
{
    public DateTime TransactionDate { get; set; }
}

