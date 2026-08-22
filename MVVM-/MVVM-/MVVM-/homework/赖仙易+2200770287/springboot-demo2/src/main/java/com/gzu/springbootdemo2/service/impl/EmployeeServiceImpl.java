package com.gzu.springbootdemo2.service.impl;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gzu.springbootdemo2.entity.Employee;
import com.gzu.springbootdemo2.mapper.EmployeeMapper;
import com.gzu.springbootdemo2.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {
   @Autowired
    private EmployeeMapper employeeMapper;

    @Override
    public List<Employee> selectPage(Integer pageNum, Integer pageSize) {
        IPage<Employee> page = new Page<>(pageNum, pageSize);
        return employeeMapper.selectPageVo(page);
    }

    @Override
    public List<Employee> selectEmployeesByFirstName(String firstName) {
        List<Employee> list=employeeMapper.selectEmployeesByFirstName(firstName);
        if(list!=null && list.size()>0)
        return list;
        else return null;
    }

    @Override
    public void add(Employee employee) {
        employeeMapper.insert(employee);
    }

    @Override
    public void updateById(Employee employee) {
        employeeMapper.updateById(employee);
    }

    @Override
    public void deleteById(Integer id) {
        employeeMapper.deleteById(id);
    }

    @Override
    public List<Employee> selectAll() {
        List<Employee> list=employeeMapper.selectAll();
        return list;
    }


}
