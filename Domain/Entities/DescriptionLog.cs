using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
    public class DescriptionLog
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(20)]
        public required string Action { get; set; }

        [Required]
        [StringLength(250)]
        public required string Detail { get; set; }

        public string? AddedBy { get; set; }

        public DateTime? DateAdded { get; set; }

        //Nav props
        public int DescriptionId { get; set; }
        public Description Description { get; set; } = null!;
    }
}
