using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
    public class ActivityLog
    {
        [Key]
        public int Id { get; set; }

        [StringLength(20)]
        public required string Action { get; set; }

        [StringLength(50)]
        public required string Detail { get; set; }

        [StringLength(50)]
        public required string IpAddress { get; set; }

        [StringLength(20)]
        public string? AddedBy { get; set; }

        public DateTime? DateAdded { get; set; }
    }
}
