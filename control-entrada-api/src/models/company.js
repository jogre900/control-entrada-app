export default (sequelize, { UUID, UUIDV4, STRING }) => {
  const Company = sequelize.define("Company", {
    id: {
      primaryKey: true,
      allowNull: false,
      type: UUID,
      defaultValue: UUIDV4()
    },
    name: {
      type: STRING,
      allowNull: false,
    },
    email: {
      type: STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: "Invalid Email",
        },
      },
    },
    dni: {
      type: STRING,
      allowNull: false,
      unique: true,
    },
  });

  Company.associate = (models) => {
    Company.hasMany(models.employee, {
      foreignKey: {
        name: "companyId",
        field: "company_id",
      },
      as: "Empleado",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Company.hasMany(models.zone, {
      foreignKey: {
        name: "companyId",
        field: "company_id",
      },
      as: "companyZone",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };
  return Company;
};
