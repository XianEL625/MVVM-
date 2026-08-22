package com.gzu.springbootdemo2.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;
/*
注意如果mysql中有_就由一个大写来比如dept_id->deptId。如果是dept_id_name则deptIdName
 */
@Data
@TableName("employees")
public class Employee {
private  Integer empId;
private  String firstName;
private String lastName;
private String email;
private  String phoneNumber;
private Date hireDate;
private String jobTitle;
private BigDecimal salary;
private  Integer  deptId;
}
