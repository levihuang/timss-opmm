<%
	 String contextPath = request.getContextPath();
	 request.getSession().getServletContext().setAttribute("baseURL", contextPath);
%>

