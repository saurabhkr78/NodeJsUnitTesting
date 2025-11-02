import { start } from "repl";
import expressApp from "./expressApp";

const PORT=process.env.PORT||8000;

export const StartServer = async() => {
    
    expressApp.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    // Handle unhandled rejections
    process.on('uncaughtException', async(error) => {
        console.log(error);
        process.exit(1); // Exit the process to avoid unknown state
    });
};

StartServer().then(() => {
    console.log("Server is Up");
});