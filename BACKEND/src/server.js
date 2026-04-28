const dns=require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);


const cors = require("cors");


const express=require('express');
const {Port}=require('./config/env.config');
const app=express();
const connectToDatabase=require('./config/db.config');



// Connect to the database
connectToDatabase();
app.use(express.json());
app.use(cors());


// Define routes
const userRoutes=require('./routes/auth.routes');
app.use('/api/auth',userRoutes);

// Company routes
const companyRoutes=require('./routes/company.routes');
app.use('/api/company',companyRoutes);


// UserCompanyRole routes
const userCompanyRoleRoutes=require('./routes/userCompanyRole.routes');
app.use('/api/user-company-role',userCompanyRoleRoutes);

// Role routes
const roleRoutes=require('./routes/role.routes');
app.use('/api/role',roleRoutes);

// Branch routes
const branchRoutes=require('./routes/branch.routes');
app.use('/api/branch',branchRoutes);

// Employee routes
const employeeRoutes=require('./routes/employee.routes');
app.use('/api/employee',employeeRoutes);

// Party routes
const partyRoutes=require('./routes/party.routes');
app.use('/api/party',partyRoutes);

// Item routes
const itemRoutes=require('./routes/item.routes');
app.use('/api/item',itemRoutes);

// Stock routes
const stockRoutes=require('./routes/stock.routes');
app.use('/api/stock',stockRoutes);

// Purchase routes
const purchaseRoutes=require('./routes/purchase.route');
app.use('/api/purchase',purchaseRoutes);

// Sales routes
const salesRoutes=require('./routes/sales.routes');
app.use('/api/sales',salesRoutes);

const ledgerRoutes = require("./routes/ledger.routes");
app.use("/api/ledger", ledgerRoutes);


app.listen(Port,()=>{
    console.log(`Server is running on port ${Port}`);
})
