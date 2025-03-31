import CppCodeExecutor from "../containers/cppCodeExecutor";
import JavaCodeExecutor from "../containers/javaCodeExecutor";
import PythonCodeExecutor from "../containers/pythonCodeExecutor";
import CodeExecutorStrategy from "../types/CodeExecutorStrategy";

export default function CreateCodeExectorObject(codeLanguage: string): CodeExecutorStrategy | null {
    if(codeLanguage === "PYTHON"){
        return new PythonCodeExecutor();
    }else if(codeLanguage === "CPP"){
        return new CppCodeExecutor();
    }else if(codeLanguage === "JAVA"){
        return new JavaCodeExecutor();
    }else{
        return null;
    }
    
}