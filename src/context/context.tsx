import { createContext, createSignal  } from "solid-js";
import run from '../config/gemini';

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = createSignal("");
    const [recentPrompt, setRecentPrompt] = createSignal("");
    const [prevPrompts, setPrevPrompts] = createSignal([]);
    const [showResult, setShowResult] = createSignal(false);
    const [loading, setLoading] = createSignal(false);
    const [resultData, setResultData] = createSignal ("");

    const delayPara = (index, nextWord) =>{
        setTimeout(function() {
            setResultData(prev=>prev+nextWord);
        },75*index)
    }

    const newChat = () => {
        setLoading(false)
        setShowResult(false)
    }


    const onSent = async (prompt) => {
        setResultData("")
        setLoading(true)
        setShowResult(true)
        let response;
        if (prompt !== undefined) {
            response == await run(prompt);
            setRecentPrompt(prompt)
        }
        else{
            setPrevPrompts(prev=>[... prev,input])
            setRecentPrompt(input)
            response = await run(input)
        }
        setRecentPrompt(input)
        setPrevPrompts(prev=>[...prev,input])
       let responseArray= response.split("**");
       let newResponse="" ;
       for (let i=0 ; i < responseArray.length; i++)
       {
        if (i === 0 || i%2 !== 1) {
            newResponse+= responseArray[i];
        }
        else {
            newResponse += "<b>" +responseArray[i]+"</b>";
        }
       }
       let newResponse2 = newResponse.split("*").join("</br>")
       let newResponseArray = newResponse2.split(" ");
       for(let i=0; i<newResponseArray.length;i++)
       {
        const nextWord = newResponseArray[i];
        delayPara(i,nextWord+" ")
       }
       setResultData(newResponse2)
       setLoading(false)
       setInput("")
    }
    
    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }

    return (
        <Context.Provider value={contextValue} >
            {props.children}
        </Context.Provider >
    )
}

export default ContextProvider