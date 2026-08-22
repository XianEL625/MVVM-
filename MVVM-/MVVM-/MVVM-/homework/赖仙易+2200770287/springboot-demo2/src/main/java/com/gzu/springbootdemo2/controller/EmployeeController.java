package com.gzu.springbootdemo2.controller;

import com.gzu.springbootdemo2.entity.Employee;
import com.gzu.springbootdemo2.service.EmployeeService;
import com.gzu.springbootdemo2.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/employees")
@CrossOrigin
@RestController
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/selectPage")
    public Result selectPage(@RequestParam(defaultValue = "1") Integer pageNum,
                                         @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        List<Employee> list=employeeService.selectPage(pageNum, pageSize);
        List<Employee> list2=(employeeService.selectAll());
        long total=list2.size();
        return Result.success(list,total);
    }

    @GetMapping("/selectby")
    public Result selectEmployeesByFirstName(@RequestParam String firstName){
        List<Employee> list=employeeService.selectEmployeesByFirstName(firstName);
        long total=list.size();
        return Result.success(list,total);
    }

    @PostMapping("/add")
    public Result add(@RequestBody Employee employee){
        employeeService.add(employee);
        return Result.success();
    }
    @PostMapping("/updataById")
    public Result updata(@RequestBody Employee employee){
        employeeService.updateById(employee);
        return Result.success();
    }

    @PutMapping("/deleteById")
    public Result deleteById(@RequestParam Integer id){
        employeeService.deleteById(id);
        return Result.success();
    }
}