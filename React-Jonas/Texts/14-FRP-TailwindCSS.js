//! Tailwind CSS Crash Course: Styling an Application
// --------------------------------------------------
/**
 * ! 1. Section Overview
 * ---------------------
 * 
 * 
 * ! 2. What is Tailwind CSS?
 * --------------------------
 * * def
 * - utility-first CSS framework packed with "utility classes" like: 
 *      - "flex", "text-center" and "rotate-90" that can be composed to build a design || directly in our markup
 * 
 * >>> Utility-First CSS OR Atomic CSS approach:
 * - writing tiny classes with single purpose and then combining them to build entire layouts
 * 
 * ? Adv and Dis of Tailwind-CSS
 * (ADV)
 *      - do not think about class names
 *      - no jumps between files | can write markup and styles at a time
 *      - understand styling in any project which uses Tailwind 
 *      - Tailwind makes UI look better and more consistent 
 *      - saves lot of time (best for responsive design)
 *      - 
 * (DIS)
 *      - markup looks unreadable: if we use lots of classes
 *      - we need to learn lot of classes 
 *      - we need to install and set-up tailwind for every project
 * 
 * 
 * ! 3. Setting Up Tailwind CSS
 * ----------------------------
 * (styling fast-react-pizza application)
 * ? Installation
 * - search for tailwind with vite => download version @3 => open terminal and run..
 * => [ npm install -D tailwindcss@3 postcss autoprefixer ]
 *      (version-3 installed according to lecture)
 * 
 * - and then open terminal and run..
 * => [ npx tailwindcss init -p ]
 *  - this then create two files:
 *      - 1. postcss.config.js
 *      - 2. tailwind.config.js
 * 
 * (open tailwind.config.js)
 * - follow step-3 that is "configuring template paths"
 *      - and follow other steps
 * 
 * - also install VS-Code extension:
 *      => Tailwind CSS IntelliSense
 * 
 * >>> after this restart the application and apply styles 
 * 
 * - open browser => search for "tailwind prettier extension"
 *      - open 1st GitHub repo from "tailwindlabs"
 * ([LINK: https://github.com/tailwindlabs/prettier-plugin-tailwindcss])
 * 
 * - and open terminal => run.. 
 * => [npm install -D prettier prettier-plugin-tailwindcss] 
 * (why?)
 *      - automatically sort order of classnames that we apply as CSS to components in the way that tailwind-css recommends
 * (if not sorted automatically.. then leave it!.. it is [optional])
 * 
 * $ NOTE:
 * * we work with classname attribute only while using "tailwindcss"
 *      >>> classname="style-property"
 * 
 * * we can search for any property that we want to style
 * 
 * 
 * ! 4.  Working With Color
 * ------------------------
 * (working with colors in tailwind)
 * - <tagname classname="property-{color}-intensity"></tagname>
 * ex:
<header className="bg-yellow-300">
 * 
 * >>> property:
 * - property is that we want to "customize"
 * ex: text, for background- bg, etc.,
 * 
 * 
 * ! 5. Styling Text
 * ----------------- 
 * (we can also style index.html)
 * >>> styling index.html
 * - we can add styles inside index.html with only "class" but not with "className"
 * ex:
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
  </head>
  <body class="bg-stone100 text-stone-700">     //>>> concentrate here!
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
 * 
 * - can style like this:
 *      - <body class="bg-stone100 text-stone-700">
 * 
 * (now)
 * ? styling text: 
 *      - text-{styling-property}
 * ex: to position: we use center, right, left etc.,
 * 
 * ? use Typography:
 * #1 font size
 *      - text-{size}
 * ex: xs, sm, base, lg, xl, 2xl, 3, 4 to 9xl etc.,
 * 
 * #2 font weight
 *      - font-{weight}
 * ex: thin, extralight, light, normal, medium, semibold, bold, extrabold, black
 * 
 * #3 letter-spacing:
 *      - tracking-{letter-space: value}
 * ex: <Link to="/" className="tracking-widest">Fast React Pizza Co.</Link>
 *      ex: classname= "tracking-widest"
 * 
 * (as widest is the highest-value)
 *      ? what if we want more ?
 *  >>> use Arbitrary-Values
 *      - tracking-[value]
 *  ex: values can be any number of "pixels" OR "rems" OR "em"
 *  ex: <Link to="/" className="tracking-[5px]">Fast React Pizza Co.</Link>
 * 
 * * arbitrary values
 *      - stylingProperty-[arbitraryValue]
 * - we can use for any property
 * ex: text-[5px]
 * 
 * $ NOTE:
 * - we should have to use only pre-defined classes from "tailwindcss"
 * 
 * 
 * ! 6. The Box Model: Spacing, Borders, and Display
 * -------------------------------------------------
 * (SPACING: using classes for "margin", "padding" etc., inside box-model)
 * 
 * * box-model includes.. 
 *      - "Spacing", "Borders", "Display"
 * 
 * #1 margin:
 * - most important properties that we need for margin are:
 * => m-0:
 *      - margin: 0px [values are applied in all directions]
 * => mx-0:
 *      - margin in "x" direction (left and right) 
 * => my-0:
 *      - margin in "y" direction (top and bottom)
 * => mt-0:
 *      - margin-top 
 * => mr-0:
 *      - margin-right
 * => mb-0:
 *      - margin-bottom
 * => ml-0:
 *      - margin-left
 * (more on tailwind-docs)
 * 
 * #1.1 padding:
 * - similar to "margin"
 * 
 * #2 border:
 * - involves two steps
 * >>> border-[direction]-[value] 
 *      => direction:
 *      - b: bottom || t: top || x: x-dir || y: y-dir
 *      => value:
 *      - values are mostly numbers [bts they are pixels by default]
 * #2.1 border-[color]-[intensity]
 * 
 * * tailwind-tricks:
 * - tailwind provides a class using that we do not need help of //=> flex-box
 *      - class that adds spacing between elements
 * 
 * #3 space-between
 * >>> space-[direction]-[value]
 *      => direction:
 *      - x and y directions
 * 
 * ex:
<p className="text-stone-300 font-semibold space-x-4 ">
    <span>23 pizzas</span>
    <span>$23.45</span>
</p>
 * 
 * #4 display
 * >>> display-[property_name]
 * (search for to know more about display-property)
 * 
 * $ LEARN-MORE:
 * - use tailwind-docs and search for "space-between" and other properties
 * 
 * 
 * ! 7. Responsive Design
 * ----------------------
 * (fundamental concept to understand in Tailwind CSS)
 * - since tailwind is mobile-first all classes that we use will apply for all screen-width
 * 
 * - by default, tailwind comes with "5 break-points" 
 * (visit "/docs/responsive-design" for more details...)
 * - there are 5 "min-width" media-queries they are:
 * >>> sm, md, lg, xl, 2xl
 *      - these 5 break-points each gets their respective values here
 * ex:
 * - sm's value will start after crossing 640px
 * 
 * 
 * ? how this works ?
 * ex:
<div className="my-10 text-center sm:my-16">
 * 
 * (className="my-10 text-center sm:my-16")
 * - defaults (mobile-first classes): my-10
 * - override (breakpoints)         : sm:my-16 {this over-rides default} 
 * (sm-value: 640px)
 * 
 * - properties without break-points {sm, md, lg, xl, 2xl} are the default ones 
 * - so properties with break-points are applied after their values crosses
 * 
 * - from the above example, "my-10" will be applied on smaller screens that is below the value of {sm: 640px}
 *      - once view-port width exceeds 640px "my-16" (from sm:my-16) will be applied (over-riding default properties)
 * 
 * $ REMEMBER:
 * - sm: px-6 means that it does not apply for "sm: small" screens 
 * - instead class: "sm:px-6" will be applied from the break-point value {sm: 640px} crosses
 * 
 * (more about these on official docs)
 * 
 * 
 * 
 * ! 8. Using Flex-box
 * ------------------- 
 * (learn: tailwinds utility classes to implement layouts with flex-box)
 * - to make a component "display: flex" (css-property) 
 * ex:
<header className="flex items-center justify-between bg-yellow-300 uppercase px-4 py-3 border-b border-stone-500 sm:px-6">
 * 
 * >>> flex{ display: flex }
 * - to make a component "flex-box"
 *      - TC-property: "flex" is enough
 * 
 * >>> items-center{ align-items: center } 
 * - TC-property: "items-center" is enough
 * 
 * >>> justify-between { justify-content: space-between }
 * - TC-property: justify-between
 * 
 * 
 * ! 9. Using CSS Grid
 * ------------------- 
 * - to make a "grid" container we have to use class: "grid"
 * - grids accept "rows" and "columns" 
 * ex:
>>> AppLayout.jsx:
---
function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  return (
    <div className="grid h-screen grid-rows-[auto_1fr_auto] ">
      {isLoading && <Loader />}
      <Header />
      <div className="overflow-scroll">
        <menu className=" max-w-3xl mx-auto">
          <Outlet />
        </menu>
      </div>
      <CartOverview />
    </div>
  );
}
export default AppLayout;
 * 
 * 
 * 
 * 
 * ! 10. Styling Buttons: Element States and Transitions
 * -----------------------------------------------------
 * (learn: element states ~ "hover", "disabled", "focus")
 * 
 * ! SKIPPED
 * 
 * 
 * 
 * ! 11. Styling Form Elements
 * ---------------------------
 * ex:
<div>
  <input
    className="rounded-full border border-stone-100 px-4 py-2 text-sm transition-all duration-300 placeholder:text-stone-400 focus:outline-none focus:ring focus:ring-yellow-300 w-full md:px-6 md:py-3"
    type="text"
    name="address"
    required
  />
</div>
 * 
 * - as we styled this component, we can apply same styles to other form-elements 
 * that is // => re-using of styles
 * that will be taught in next lecture!
 * 
 * 
 * ! 12. Reusing Styles With @apply
 * --------------------------------
 * (reusing of styles inside a form-component: using tailwind's "APPLY" directive)
 * 
 * - open index.css (main-styles-file)
 *    - by doing the following..
 * ex:
@layer components {
  .input {
    @apply rounded-full border border-stone-100 px-4 py-2 text-sm transition-all duration-300 placeholder:text-stone-400 focus:outline-none focus:ring focus:ring-yellow-300 w-full md:px-6 md:py-3
  }
}
 * 
 * - no we can apply "input" (.input {..}) as a value while styling same form-elements
 * ex:
<div>
  <label>First Name</label>
  <input className="input" type="text" name="customer" required />
</div>
<div>
  <label>Phone number</label>
  <div>
    <input className="input" type="tel" name="phone" required />
  </div>
  {formErrors?.phone ? <p>{formErrors.phone}</p> : ""}
</div>
<div>
  <label>Address</label>
  <div>
    <input className="input" type="text" name="address" required />
  </div>
</div>
 * 
 * $ NOTE:
 * - we cannot follow this way doing CSS.. as this resembles writing CSS but not Tailwind-CSS 
 * (CSS: writing classes inside a separate file and applying them..)
 * 
 * 
 * ! 13. Reusing Styles With React Components
 * ------------------------------------------
 * (best way: to reuse styles in Tailwind-CSS >>> by creating react-components)
 * - while creating a button.. we have applied many TC-classes to that.. 
<button
  disabled={isSubmitting}

  className="inline-block rounded-full bg-yellow-400 px-4 py-3 uppercase font-semibold tracking-wide text-stone-800 hover:bg-yellow-300 transition-colors duration-300 focus:bg-yellow-300 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-offset-1 disabled:cursor-not-allowed"
>
  {isSubmitting ? "Placing order..." : "Order now"}
</button> 
 * 
 * - to re-use a style (cause of so many properties or classes!)
 * - we created below button-component!
 * ex:
function Button({ children, onDisabled }) {
  return (
    <button
      disabled={onDisabled}
      className="inline-block rounded-full bg-yellow-400 px-4 py-3 uppercase font-semibold tracking-wide text-stone-800 hover:bg-yellow-300 transition-colors duration-300 focus:bg-yellow-300 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-offset-1 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}
export default Button;
 * 
 * - so that we can use it inside "CreateOrder.jsx"
 * ex:
<Button onDisabled={isSubmitting}>
  {isSubmitting ? "Placing order..." : "Order now"}
</Button>
 * 
 * 
 * ! 14. Absolute Positioning, z-index, and More
 * ---------------------------------------------
 * (formatting "Loader.jsx")
 * - to render a loading-spinner over a page at middle of the page by blurring the page behind it!
 * 
 * - to make the element position absolutely we have to use:
 * >>> class: absolute
 * 
 * - to stretch "Loader" all over the page:
 *    - we can make top, bottom, left and right to zero
 * >>> class: inset-0 
 * 
 * - add opacity to a component:
 *    - by adding slash to the background-color-[intensity_value]/[value]
 * >>> bg-slate-300/50
 * 
 * - to add blur to the background, we can use [backdrop-blur-[value]]:
 * >>> backdrop-blur-sm
 * 
 * - to make an element place at center of a page:
 *    - use flex-box:
 * >>> flex items-center justify-center 
 * 
 * 
 * ! 15. Configuring Tailwind: Custom Font Family
 * ----------------------------------------------
 * (tailwind's advantage: extreme flexibility to configure tailwind)
 * - open "tailwind.config.js"
 *    - where we can override everything that was set to default!
 *      - here we are overriding default font-family
 *
 * - inside "tailwind.config.js" 
 *    - if we want to keep older styles and add new ones we have to place new ones inside "extend: {}" 
 * ex:
extend: {
  colors: {
    pizza: "#9876"
  }
},
 * 
 * - above code add new color >>> pizza: "#9876"
 *    - to the existing colors
 * 
 * - but we have to change most imp one is "height" >>> and we have to change "screen"
 *    - default style is..
height: {
  screen: '100vh'
}
 * 
 * - so we have to change this value.. which may rise problems with mobile-screens 
 * ex:
extend: {
  colors: {
    pizza: "#9876"
  },
  height: {
    screen: "100dvh"
  }
},
 * 
 * - we have to change from "vh" to "dvh"
 * >>> dvh
 *    - dynamic-viewport-height units 
 * (this removes problem with mobile screen-heights)
 * 
 * 
 * ! 16. Styling the Menu
 * ----------------------
 * - between every "MenuItem" we need a "line" not a "space"
 *    - so we have to use "divide: for lines" not "space-class: for spaces"
 * 
 * - so we have to apply whatever the class might be either "space" or "divide" on parent-element.. (so that styles can be applied to children)
 * 
 * - we wanted to add a line for list-elements "li" here!
 *    - so we have to apply "divide" on "ul"
 * ex:
<ul className="divide-y divide-stone-300 px-2">
  {menu.map((pizza) => (
    <MenuItem key={pizza.id} pizza={pizza} />
  ))}
</ul>
 * 
 * - hence the complete file with styles is: 
 * ex:
Menu.jsx
---
return (
  <ul className="divide-y divide-stone-300 px-2">
    {menu.map((pizza) => (
      <MenuItem key={pizza.id} pizza={pizza} />
    ))}
  </ul>
);

MenuItem.jsx:
---
return (
  <li className="flex gap-3 py-2">
    <img
      src={imageUrl}
      alt={name}
      className={`h-[8rem] ${soldOut ? "opacity-[0.6] grayscale" : ""}`}
    />

    <div className="flex flex-col grow pt-[2px]">
      <p className="font-medium">{name}</p>

      <p className="text-sm italic text-stone-600 capitalize">
        {ingredients.join(", ")}
      </p>

      <div className="mt-auto flex items-center justify-between">
        {!soldOut ? (
          <p className="text-sm">{formatCurrency(unitPrice)}</p>
        ) : (
          <p className="text-sm uppercase font-medium text-stone-400">
            Sold out
          </p>
        )}

        <Button type="small">Add to cart</Button>
      </div>
    </div>
  </li>
);
 * 
 * 
 * 
 * ! 17. Styling the Cart
 * ---------------------
 * 
 * ! 1. Section Overview
 * ---------------------
 * 
 * ! 1. Section Overview
 * ---------------------
 * 
 * ! 1. Section Overview
 * ---------------------
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */
