'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Deliveries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      orderId: {
        type: Sequelize.INTEGER,
        references: { model: 'Orders', key: 'id' },
        onDelete: 'SET NULL',
        allowNull: true,
      },
      customerId: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL',
        allowNull: true,
      },
      riderId: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL',
        allowNull: true,
      },
      deliveryAddress: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      deliveryLocation: {
        type: Sequelize.GEOMETRY('POINT'),
        allowNull: false,
      },
      estimatedDeliveryTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      realDeliveryTime: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Deliveries');
  },
};
