class User {
  constructor(mail, fname, lname, username, password) {
    this.mail = mail;
    this.fname = fname;
    this.lname = lname;
    this.username = username;
    this.password = password;
  }

  save(client, clientSettings) {
    return client.add("cn="+ user.mail +",ou=users," + clientSettings.dc, this.getJSON(), function(err) {
      if(err==null) {
        return true;
      }else {
        return false;
      }
    });
  }

  getJSON() {
    return {
      sn: this.lname,
      givenName: this.fname,
      uid: this.username,
      cn: this.fname + " " + this.lname,
      userPassword: this.password,
      objectClass: ["person", "organizationalPerson", "inetOrgPerson"]
    }
  }
}
