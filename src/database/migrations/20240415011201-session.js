"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Session", {
      sid: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      userId: Sequelize.STRING,
      expires: Sequelize.DATE,
      data: Sequelize.TEXT
      // sid: {
      //   type: Sequelize.STRING,
      //   allowNull: false,
      //   primaryKey: true
      // },
      // agent: {
      //   type: Sequelize.STRING,
      //   defaultValue: "",
      //   allowNull: true
      // },
      // valid: {
      //   type: Sequelize.BOOLEAN,
      //   allowNull: false
      // }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Session")
  }
}
