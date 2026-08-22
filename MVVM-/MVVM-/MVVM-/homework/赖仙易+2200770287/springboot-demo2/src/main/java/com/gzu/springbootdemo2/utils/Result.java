package com.gzu.springbootdemo2.utils;

import lombok.Data;

@Data
public class Result {
    private String code;
    private String msg;
    private Object data;
    private Long total;

    public static Result success() {
        Result result=new Result();
        result.setCode("200");
        result.setMsg("请求成功");
        return result;
    }

    public static Result success(Object data) {
        Result result=success();
        result.setData(data);
        return result;
    }

    public static Result success(Object data,Long total) {
        Result result=success();
        result.setTotal(total);
        result.setData(data);
        return result;
    }

    public  static Result error(){
        Result result=new Result();
        result.setCode("500");
        result.setMsg("系统错误");
        return result;
    }


}