using System.ComponentModel.DataAnnotations;


namespace Core.Models
{
    public class Car
    {
        [Key]
        public string Plates { get; set; }
        [Required]
        public string Name { get; set; }
        public int CarTypeId { get; set; }
        public int ColorId { get; set; }
        public int NumberOfSeats { get; set; }

        public CarType CarType { get; set; }
        public Color Color { get; set; }
    }
}
