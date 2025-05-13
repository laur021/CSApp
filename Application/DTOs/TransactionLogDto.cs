using System;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

public class TransactionLogDto
{
        public int Id { get; set; }
        
        public string Action { get; set; } = null!;

        public string Detail { get; set; } = null!;

        public string? AddedBy { get; set; }

        public DateTime? DateAdded { get; set; }

        [Required]
        public string TransactionId { get; set; } = null!;
}
