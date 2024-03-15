import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { createContext, useEffect, useState } from "react";
import { lookUpSession } from "./common/session";
import Editor from "./pages/editor.pages";
import HomePage from "./pages/home.page";
import SearchPage from "./pages/search.page";
import PageNotFound from "./pages/404.page";
import ProfilePage from "./pages/profile.page";

import BlogPage from "./pages/blog.page";

export const UserContext = createContext({});

const App = () => {
  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {
    const user = JSON.parse(lookUpSession("user"));
    if (user) {
      setUserAuth(user);
    } else {
      setUserAuth({ access_token: null });
    }
  }, []);

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route path="/editor" element={<Editor />} />
        <Route path="/" element={<Navbar />}>
          <Route index element={<HomePage />} />
          <Route path="signin" element={<UserAuthForm type="sign-in" />} />
          <Route path="signup" element={<UserAuthForm type="sign-up" />} />
          <Route path="search/:query" element={<SearchPage />} />
          <Route path="/user/:id" element={<ProfilePage />} />
          <Route path="blog/:blog_id" element={<BlogPage/>} />

        <Route path="*" element={<PageNotFound />} />
        </Route>
      

      </Routes>
    </UserContext.Provider>
  );
};

export default App;
