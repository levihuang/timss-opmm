package com.timss.opmm.web;

import java.util.Arrays;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.rememberme.InvalidCookieException;
import org.springframework.security.web.authentication.rememberme.TokenBasedRememberMeServices;
import org.springframework.util.DigestUtils;

public class IPTokenBasedRememberMeServices extends TokenBasedRememberMeServices {
    
    private static final ThreadLocal<HttpServletRequest> requestHolder = new ThreadLocal<HttpServletRequest>();

    public HttpServletRequest getContext() {
        return requestHolder.get();
    }

    public void setContext(HttpServletRequest context) {
        requestHolder.set( context );
    }

    /**
     * @description:获取IP地址
     * @author: fengzt
     * @createDate: 2014年3月19日
     * @param request
     * @return:
     */
    public String getUserIPAddress(HttpServletRequest request) {
        return request.getRemoteAddr();
    }

    /**
     * set IP to the cookie
     */
    @Override
    protected void setCookie(String[] tokens, int maxAge, HttpServletRequest request, HttpServletResponse response) {
        // append the IP adddress to the cookie
        String[] tokensWithIPAddress = Arrays.copyOf( tokens, tokens.length + 1 );
        tokensWithIPAddress[tokensWithIPAddress.length - 1] = getUserIPAddress( request );
        super.setCookie( tokensWithIPAddress, maxAge, request, response );
    }

    /**
     * 使用MD5加密
     */
    @Override
    protected String makeTokenSignature(long tokenExpiryTime, String username, String password) {
        return DigestUtils
                .md5DigestAsHex( (username + ":" + tokenExpiryTime + ":" + password + ":" + getKey() + ":" + getUserIPAddress( getContext() ))
                        .getBytes() );
    }

    /**
     * 校验IP地址是否一致
     */
    @Override
    protected UserDetails processAutoLoginCookie(String[] cookieTokens, HttpServletRequest request,
            HttpServletResponse response) {
        try {
            setContext( request );
            // take off the last token
            String ipAddressToken = cookieTokens[cookieTokens.length - 1];
            if ( !getUserIPAddress( request ).equals( ipAddressToken ) ) {
                throw new InvalidCookieException( "Cookie IP Address did not contain a matching IP (contained '"
                        + ipAddressToken + "')" );
            }
            return super.processAutoLoginCookie( Arrays.copyOf( cookieTokens, cookieTokens.length - 1 ), request,
                    response );

        } finally {
            setContext( null );
        }
    }

    /**
     * 先登录
     */
    @Override
    public void onLoginSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication successfulAuthentication) {
        setContext( request );
        super.onLoginSuccess( request, response, successfulAuthentication );
        setContext( null );
    }

}
