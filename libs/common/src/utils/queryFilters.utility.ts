import { IncludeOptions, Op, WhereOptions } from 'sequelize';

export interface Filter {
  columnName: string;
  option: 'equal' | 'notequal' | 'contains';
  value: string | number | boolean;
}

export const queryFilters = (
  where: WhereOptions = {},
  filters: Filter[] = [],
  includes: IncludeOptions[] = [],
) => {
  try {
    filters.forEach((filter) => {
      const { columnName, option, value } = filter;

      if (columnName.includes('.')) {
        // Filter on association
        const [associationName, fieldName] = columnName.split('.');

        // Find the association to filter
        const association = includes.find(
          (assoc) => assoc.association === associationName,
        );
        if (!association) {
          throw new Error(`Unknown filter option: ${option}`);
        }
        if (!association.where) {
          association.where = {};
        }
        switch (option) {
          case 'equal':
            association.where[fieldName] = value;
            break;
          case 'notequal':
            association.where[fieldName] = { [Op.ne]: value };
            break;
          case 'contains':
            association.where[fieldName] = { [Op.like]: `%${value}%` };
            break;
          default:
            throw new Error(`Unknown filter option: ${option}`);
        }
      } else {
        // Filter on User table
        switch (option) {
          case 'equal':
            where[columnName] = value;
            break;
          case 'notequal':
            where[columnName] = { [Op.ne]: value };
            break;
          case 'contains':
            where[columnName] = { [Op.like]: `%${value}%` };
            break;
          default:
            return {
              success: false,
              message: `Unknown filter option: ${option}`,
            };
        }
      }
    });
    return { success: true, data: { where, includes } };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
