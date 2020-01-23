using System.ComponentModel.DataAnnotations;

namespace Core.Common
{
    public class KeyValue
    {
        public int Id { get; set; }
        [Required]
        public string Value { get; set; }
    }
}
