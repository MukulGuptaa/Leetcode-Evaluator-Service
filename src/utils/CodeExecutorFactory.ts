import CppCodeExecutor from "../containers/cppCodeExecutor";
import JavaCodeExecutor from "../containers/javaCodeExecutor";
import PythonCodeExecutor from "../containers/pythonCodeExecutor";
import CodeExecutorStrategy from "../types/CodeExecutorStrategy";

export default function CreateCodeExectorObject(codeLanguage: string): CodeExecutorStrategy | null {
    if(codeLanguage.toLowerCase() === "python"){
        return new PythonCodeExecutor();
    }else if(codeLanguage.toLowerCase() === "cpp"){
        return new CppCodeExecutor();
    }else if(codeLanguage.toLowerCase() === "java"){
        return new JavaCodeExecutor();
    }else{
        return null;
    }
    
}