import React, {useEffect} from "react";

import AppBar from "./AppBar";
import Introduction from "./Introduction";
import Features from "./Features";

import { useDispatch, useSelector } from "react-redux";
import { getContent } from "../../../redux/slices/landing";

function Presentation() {
  const dispatch = useDispatch();
  const { content } = useSelector((state) => state.content);

  useEffect(() => {
    dispatch(getContent());
  }, [dispatch, content?.title]);

  return (
    <React.Fragment>
      <AppBar content={content} />
      <Introduction content={content} />
      <Features content={content} />
    </React.Fragment>
  );
}

export default Presentation;
