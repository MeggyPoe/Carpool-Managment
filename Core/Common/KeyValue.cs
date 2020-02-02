using System;

namespace Core.Common
{
    public class KeyValue<T> where T : IComparable, IConvertible
    {
        public T Id { get; set; }
        public string Value { get; set; }
    }
}
