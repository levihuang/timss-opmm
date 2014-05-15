package com.timss.opmm.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class SpringTest {

    @RequestMapping(value="/sayHi",method=RequestMethod.GET)
    public  String sayHi(){
        System.out.println( "hello " );
        System.out.println( " your are my person !! ");
        return "index";
    }
    
    
    @RequestMapping(value="/goodBye",method=RequestMethod.GET)
    public String goodBye(){
        System.out.println( "goodBye " );
        System.out.println( " your are my person, goodBye !! ");
        return "logout";
    }
    @RequestMapping(value="/welcome",method=RequestMethod.GET)
    public String welcome(){
        System.out.println( "welcome " );
        System.out.println( " your are my person, welcome !! ");
        return "welcome";
    }
}
