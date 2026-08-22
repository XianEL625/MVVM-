package com.gzu.springbootdemo2.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gzu.springbootdemo2.entity.Employee;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface EmployeeMapper  {

    List<Employee> selectPageVo(IPage<Employee> page);
    List<Employee> selectEmployeesByFirstName(String firstName);

    List<Employee> selectAll();

     void updateById(Employee employee);

    void insert(Employee employee);

    void deleteById(Integer id);
}