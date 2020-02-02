using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Core.IRepositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

namespace Persistance.Repositories
{
    public class EntityRepository<TEntity> : IEntityRepository<TEntity> where TEntity : class
    {
        protected readonly CarpoolManagmentContext _dbContext;
        protected readonly DbSet<TEntity> _dbSet;

        public EntityRepository(CarpoolManagmentContext context)
        {
            _dbContext = context;
            _dbSet = context.Set<TEntity>();
        }

        public void Create(TEntity entity)
        {
            _dbSet.Add(entity);
        }

        public void Update(TEntity entity)
        {
            _dbSet.Update(entity);
        }

        public TEntity Get(object id)
        {
            var entity = _dbSet.Find(id);
            return entity;
        }

        public IQueryable<TEntity> GetAllWhere(Expression<Func<TEntity, bool>> expression)
        {
            return _dbSet.Where(expression);
        }

        public IQueryable<TEntity> ReadAll()
        {
            return _dbSet.AsNoTracking();
        }

        public IQueryable<TEntity> ReadAllWhere(Expression<Func<TEntity, bool>> expression)
        {

            return _dbSet.Where(expression).AsNoTracking();
        }

        public void Save()
        {
            _dbContext.SaveChanges();
        }

        public void Delete(object id)
        {
            TEntity entityToDelete = _dbSet.Find(id);

            if (entityToDelete != null)
            {
                _dbSet.Remove(entityToDelete);
            }
        }
    }
}
