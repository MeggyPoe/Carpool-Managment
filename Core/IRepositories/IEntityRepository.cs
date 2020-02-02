using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace Core.IRepositories
{
    public interface IEntityRepository<TEntity> where TEntity : class
    {
        TEntity Get(object id);
        IQueryable<TEntity> GetAllWhere(Expression<Func<TEntity, bool>> expression);
        IQueryable<TEntity> ReadAll();
        IQueryable<TEntity> ReadAllWhere(Expression<Func<TEntity, bool>> expression);
        void Create(TEntity entity);
        void Update(TEntity entity);
        void Delete(object id);
        void Save();
    }
}
