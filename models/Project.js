const pool = require('../config/db');

const Project = {
    getAll: async () => {
        const [rows] = await pool.query('SELECT * FROM Projects');
        return rows;
    },
    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM Projects WHERE ProjectID = ?', [id]);
        return rows[0];
    },
    create: async (data) => {
        const { ProjectName, ProjectAddress, StartDate, EndDate, ContractAmount, ClientName, ClientContact, Notes } = data;
        const [result] = await pool.query(
            'INSERT INTO Projects (ProjectName, ProjectAddress, StartDate, EndDate, ContractAmount, ClientName, ClientContact, Notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [ProjectName, ProjectAddress, StartDate, EndDate, ContractAmount, ClientName, ClientContact, Notes]
        );
        return result.insertId;
    },
    update: async (id, data) => {
        const { ProjectName, ProjectAddress, StartDate, EndDate, ContractAmount, ClientName, ClientContact, Notes } = data;
        await pool.query(
            'UPDATE Projects SET ProjectName = ?, ProjectAddress = ?, StartDate = ?, EndDate = ?, ContractAmount = ?, ClientName = ?, ClientContact = ?, Notes = ? WHERE ProjectID = ?',
            [ProjectName, ProjectAddress, StartDate, EndDate, ContractAmount, ClientName, ClientContact, Notes, id]
        );
    },
    delete: async (id) => {
        await pool.query('DELETE FROM Projects WHERE ProjectID = ?', [id]);
    }
};

module.exports = Project;