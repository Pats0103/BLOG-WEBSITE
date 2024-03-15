import React from "react";
const Img = ({ url, caption }) => {
  return (
    <div>
      <img src={url} alt="" className="w-full" />
      {caption && (
        <p className="text-center text-sm my-3 md:mb-12  w-full text-dark-grey">
          {caption}
        </p>
      )}
    </div>
  );
};

const Quote = ({ text, caption }) => {
  return (
    <div className="bg-purple/10 p-3 pl-5 border-l-4 border-purple">
      <p className="text-xl leading-9 md:text-2xl">{text}</p>
      {caption && <p className="text-xl leading-10 md:text-2xl">{caption}</p>}
    </div>
  );
};
function BlogContent({ block }) {
  let { type, data } = block;
  if (type === "paragraph") {
    return <p dangerouslySetInnerHTML={{ __html: data.text }}></p>;
  }
  if (type === "header") {
    if (data.level === 3) {
      return (
        <h3
          className="text-3xl font-bold"
          dangerouslySetInnerHTML={{ __html: data.text }}
        ></h3>
      );
    }

    return (
      <h2
        className="text-4xl font-bold"
        dangerouslySetInnerHTML={{ __html: data.text }}
      ></h2>
    );
  }

  if (type === "image") {
    return <Img url={data.file.url} caption={data.caption} />;
  }

  if (type == "quote") {
    return <Quote text={data.text} caption={data.caption} />;
  }

    if (type === "list") {
        if (data.style === "ordered") {
        return (
            <ol className="list-decimal list-inside">
            {data.items.map((item, index) => (
                <li
                key={index}
                className="text-xl leading-9 md:text-2xl"
                dangerouslySetInnerHTML={{ __html: item }}
                ></li>
            ))}
            </ol>
        );
        }
        return (
        <ul className="list-disc list-inside">
            {data.items.map((item, index) => (
            <li
                key={index}
                className="text-xl leading-9 md:text-2xl"
                dangerouslySetInnerHTML={{ __html: item }}
            ></li>
            ))}
        </ul>
        );
    }
}

export default BlogContent;
