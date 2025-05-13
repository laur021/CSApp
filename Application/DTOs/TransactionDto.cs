using System;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

using System;
using System.ComponentModel.DataAnnotations;

using System;
using System.Collections.Generic;

public class TransactionDto
{
    public int? Id { get; set; }
    public string TransactionId { get; set; } = null!;
    public string TransactionType { get; set; } = null!;
    public int? Mode { get; set; }
    public string Customer { get; set; } = null!;
    public DateTime PickUpDate { get; set; }
    public DateTime TakeOffDate { get; set; }
    public int Duration { get; set; }
    // public int ProductId { get; set; }
    public string ProductName { get; set; } = null!;
    // public int DescriptionId { get; set; }
    public string DescriptionName { get; set; } = null!;
    public string Remarks { get; set; } = null!;
    public string RepliedBy { get; set; } = null!;
    public string Status { get; set; } = null!;
    public string? AddedBy { get; set; }
    public DateTime? DateAdded { get; set; }
}

public class TransactionWithLogsDto
{
    public int? Id { get; set; }

    public  string TransactionId { get; set; } = null!;
    
    public  string TransactionType { get; set; } = null!;

    public int? Mode { get; set; }

    public string Customer { get; set; } = null!;
    
    public DateTime PickUpDate { get; set; }
    
    public DateTime TakeOffDate { get; set; }
    
    public TimeSpan Duration { get; set; }

    // public int ProductId { get; set; }
    
    public string ProductName {get; set;} = null!;

    //  public int DescriptionId { get; set; }

    public string DescriptionName {get; set;} = null!;

    public string Remarks { get; set; } = null!;
    
    public string RepliedBy { get; set; } = null!;
    
    public string Status { get; set; } = null!;

    public string? AddedBy { get; set; }

    public DateTime? DateAdded { get; set; }

    public ICollection<TransactionLogDto> TransactionLogs { get; set; } = [];
}

public class TransactionCreateDto
{
    // public int? Id { get; set; }

    [Required(ErrorMessage = "Transaction ID is required.")]
    [StringLength(20, ErrorMessage = "Transaction ID cannot exceed 20 characters.")]
    public string TransactionId { get; set; } = null!;

    [Required(ErrorMessage = "Transaction type is required.")]
    [StringLength(10, ErrorMessage = "Transaction type cannot exceed 10 characters.")]
    public string TransactionType { get; set; } = null!;

    public int? Mode { get; set; }

    [Required(ErrorMessage = "Customer name is required.")]
    [StringLength(50, ErrorMessage = "Customer name cannot exceed 50 characters.")]
    public string Customer { get; set; } = null!;

    [Required(ErrorMessage = "Pick-up date is required.")]
    [DataType(DataType.DateTime, ErrorMessage = "Invalid date format for pick-up date.")]
    public DateTime PickUpDate { get; set; }

    [Required(ErrorMessage = "Take-off date is required.")]
    [DataType(DataType.DateTime, ErrorMessage = "Invalid date format for take-off date.")]
    [CustomValidation(typeof(TransactionCreateDto), "ValidateTakeOffDate")]
    public DateTime TakeOffDate { get; set; }

    [Required(ErrorMessage = "Duration is required.")]
    [Range(0, int.MaxValue, ErrorMessage = "Duration must be a positive number.")]
    public int Duration { get; set; }

    [StringLength(250, ErrorMessage = "Remarks cannot exceed 250 characters.")]
    public string? Remarks { get; set; }

    [StringLength(100, ErrorMessage = "Replied by cannot exceed 100 characters.")]
    public string RepliedBy { get; set; } = null!;

    [Required(ErrorMessage = "Status is required.")]
    [StringLength(50, ErrorMessage = "Status cannot exceed 50 characters.")]
    public string Status { get; set; } = null!;

    [StringLength(100, ErrorMessage = "Added by cannot exceed 100 characters.")]
    public string? AddedBy { get; set; }

    [DataType(DataType.DateTime, ErrorMessage = "Invalid date format for date added.")]
    public DateTime? DateAdded { get; set; }

    [Required(ErrorMessage = "Description ID is required.")]
    public int DescriptionId { get; set; }

    // Custom validation method for TakeOffDate
    public static ValidationResult ValidateTakeOffDate(DateTime takeOffDate, ValidationContext context)
    {
        var instance = (TransactionCreateDto)context.ObjectInstance;
        if (takeOffDate < instance.PickUpDate)
        {
            return new ValidationResult("Take-off date must be after the pick-up date.");
        }
        return ValidationResult.Success!;
    }
}