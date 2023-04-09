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
  async sendRecovery(email){
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const payload = {
      sub: user.id,
    }
    const token = jwt.sign(payload, config.jwtSecret, {expiresIn: '15min'});
    const link = `http://localhost/3000?token=${token}`;
    await service.update(user.id, {recoveryToken: token});
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
  async changePassword (token, newPassword){
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      const user = await service.findOne(payload.sub);
      if (user.recoveryToken !== token) {
        throw boom.unauthorized();
      }
      const hash = await bcrypt.hash(newPassword, 10);
      await service.update(user.id, {
        recoveryToken: null, 
        password: hash,
      });
      return {
        password: "The password has been changed"
      }
    } catch (error) {
      throw boom.unauthorized();
    }
  }
}

module.exports = AuthService;

