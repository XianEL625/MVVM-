package com.gzu.springbootdemo2.vo;

import com.gzu.springbootdemo2.entity.Employee;
import lombok.Data;

import java.util.List;

@Data

public class EmployeeVO {
    private List<Employee> list;
    private long total;
}
