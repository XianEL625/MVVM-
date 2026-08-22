package com.gzu.springbootdemo2.service;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gzu.springbootdemo2.entity.Employee;
import com.gzu.springbootdemo2.vo.EmployeeVO;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface EmployeeService  {
     //分页查询员工信息

    List<Employee> selectPage(Integer pageNum, Integer pageSize);

    List<Employee> selectEmployeesByFirstName(String firstName);

    List<Employee> selectAll();

    void add(Employee employee);

    void updateById(Employee employee);

    void deleteById(Integer id);
}