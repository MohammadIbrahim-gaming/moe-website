RSA rsa = new RSA("19","79","17");
String msg = "Hello World";
msg = rsa.encrypt(msg);
System.out.println(msg);
msg = rsa.decrypt(msg);
System.out.println(msg);
