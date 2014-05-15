package com.timss.opmm.web;

import java.util.Date;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 
 * @title: 账号
 * @description: {desc}
 * @company: CSAIR
 * @className: AccoutControler.java
 * @author: fengzt
 * @createDate: 2014年3月19日
 * @updateUser: fengzt
 * @version: 1.0
 */
@Controller
@RequestMapping("/account")
public class AccoutControler {

	/**
	 * test by fengzt 20140430
	 * @return
	 */
    @RequestMapping("/buy")
    public String buy(){
        System.out.println( "buy something " +  new Date() );
        System.out.println( "buy something " +  new Date() );
        System.out.println("print date " + new Date());
        return "index";
    }
    
}
