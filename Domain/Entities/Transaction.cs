using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
    public class Transaction
    {
        [Key]
        public required int Id { get; set; }

        [Required]
        [StringLength(20)]
        public required string TransactionId { get; set; }

        [Required]
        [StringLength(10)]
        public required string TransactionType { get; set; }

        public int? Mode { get; set; }

        [Required]
        [StringLength(50)]
        public required string Customer { get; set; }

        [Required]
        public DateTime PickUpDate { get; set; }

        [Required]
        public DateTime TakeOffDate { get; set; }

        [Required]
        public int Duration { get; set; }

        [StringLength(250)]
        public string? Remarks { get; set; }

        [Required]
        [StringLength(50)]
        public required string RepliedBy { get; set; }

        [Required]
        [StringLength(10)]
        public required string Status { get; set; }

        [StringLength(50)]
        public string? AddedBy { get; set; }

        public DateTime? DateAdded { get; set; }

        //Nav props -start
        public int DescriptionId { get; set; }

        public Description Description { get; set; } = null!;

        public ICollection<TransactionLog> TransactionLogs { get; set; } = [];
        
        //Nav props -end
        
        public bool? IsDeleted { get; set; }
    }
}
