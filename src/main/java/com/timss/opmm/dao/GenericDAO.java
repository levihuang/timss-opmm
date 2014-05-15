package com.timss.opmm.dao;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.Selection;

/**
 * DAO的超类，提供公共的方法重用
 * 
 * @author Ben
 * 
 * @param <T>
 * @param <ID>
 */
public interface GenericDAO<T, ID extends Serializable> {
    /**
     * 根据id查找对象
     * 
     * @param id
     *            对象id
     * @param lock
     *            锁定模式
     * @return 返回查找到的对象
     */
    T findById(ID id, boolean lock);

    /**
     * 查找所有T类型的对象
     * 
     * @return
     */
    List<T> findAll();

    /**
     * 根据条件查找对象列表
     * 
     * @param selections
     *            条件列表
     * @return
     */
    List<T> findByCriteria(Selection<?>... selections);

    /**
     * 保存对象
     * 
     * @param entity
     * @return
     */
    T makePersistent(T entity);

    /**
     * 删除对象
     * 
     * @param entity
     */
    void makeTransient(T entity);

    /**
     * 同步persistence context到数据库
     */
    void flush();

    /**
     * 清除persistence context
     */
    void clear();

    /**
     * 获取em
     * 
     * @return
     */
    EntityManager getEM();

    /**
     * 根据原生sql 查询获取数据适用于多表或单表的原生sql查询
     * 
     * @param sql
     * @return 查询的对象
     */
    Object findNative(String sql);

    /**
     * 根据hql查询
     * 
     * @param sql
     * @return 查询对象列表
     */
    List<T> query(String hql);

    /**
     * 根据hql与查询参数查询数据
     * 
     * @param hql
     *            hql
     * @param params
     *            查询参数列表
     * @return
     */
    List<?> query(String hql, List<Object> params);

    /**
     * 删除
     * @param t
     * @throws RuntimeException
     */
    void remove(T t) throws RuntimeException;

    /**
     * 批量删除
     * @param ts
     */
    void remove(Collection<T> ts);
}
