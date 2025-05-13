using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
    public class TransactionLog
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(20)]
        public required string Action { get; set; }

        [Required]
        [StringLength(500)]
        public required string Detail { get; set; }

        public string? AddedBy { get; set; }

        public DateTime? DateAdded { get; set; }

        // Foreign key to Transaction (using TransactionId, which is a string)
        public string TransactionId { get; set; } = null!;
    
        // Navigation property
        public Transaction Transaction { get; set; } = null!;
    }
}
