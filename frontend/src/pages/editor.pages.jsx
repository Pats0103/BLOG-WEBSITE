import React, { createContext, useContext, useState } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component";

const blogStructure ={
  title: "",
  banner: "",
  content: [],
  tags: [],
  author:{personal_info:{}}

}

export const EditorContext = createContext({});

function Editor() {
  const [blog, setBlog] = useState(blogStructure);
  const [editorState, setEditorState] = useState("editor");
  const {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);


  return (
    <EditorContext.Provider value={{blog ,setBlog,editorState,setEditorState}}>
      {access_token === null ? (
        <Navigate to="/signin" />
      ) : editorState === "editor" ? (
        <><BlogEditor/></>
      ) : (
        <>
        <PublishForm />
        </>
      )}
    </EditorContext.Provider>
  );
}

export default Editor;