const UserService = require('./user.service');
const service = new UserService();
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { config } = require('../config/config');
const nodemailer = require('nodemailer');

class AuthService {
  async getUser(email, password) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      throw boom.unauthorized();
    }
    delete user.dataValues.password;
    return user;
  }
  signToken(user){
    const payload = {
      sub: user.id,
      role: user.role,
    }
    const token = jwt.sign(payload, config.jwtSecret);
    return {
      user, 
      token
    }
  }
  async sendRecovery(){
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const payload = {
      sub: user.id,
    }
    const token = jwt.sign(payload, config.jwtSecret, {expiresIn: '15min'});
    const link = `http://localhost/3000?token=${token}`
    const info = {
      from: config.gmailUser,
      to: email,
      subject: "Recovery password mail", 
      text: "Hola, David", 
      html: `<b>Click on this link to recover your password${link}, this link expires in 15 minuts</b>`, 
    }
    const rta = await this.sendMail(info);
    return rta;
  }
  async sendMail(infoMail){
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: config.gmailUser, 
        pass: config.gmailPassword,
      },
    });
    await transporter.sendMail(infoMail);
    return { 
      message: 'Mail sent'
    }
  }
}

module.exports = AuthService;