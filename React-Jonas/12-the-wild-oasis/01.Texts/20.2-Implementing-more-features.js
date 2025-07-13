// ! Implementing More Features: "Authentication", "Dark-Mode", "Dashboard" etc.,
// ------------------------------------------------------------------------------
// ! PART - 2 !
/**
 * ! 22. Building The App Header
 * -----------------------------
 * [code]
 * ------
// >>> Header
---
function Header() {
  return (
    <StyledHeader>
      <UserAvatar />
      <HeaderMenu />
    </StyledHeader>
  );
}
---------------------------- CONNECTED ----------------------------
// >>> UserAvatar
---
function UserAvatar() {
  const { user } = useLoggedInUser();
  const { fullName, avatar } = user.user_metadata;

  return (
    <StyledUserAvatar>
      <Avatar
        src={avatar || "default-user.jpg"}
        alt={`Avatar of ${fullName}`}
      />
      <span>{fullName}</span>
    </StyledUserAvatar>
  );
}
---------------------------- CONNECTED ----------------------------
// >>> HeaderMenu
---
function HeaderMenu() {
  const navigate = useNavigate();

  return (
    <StyledHeaderMenu>
      <li>
        <ButtonIcon onClick={() => navigate("/account")}>
          <HiOutlineUser />
        </ButtonIcon>
      </li>
      <li>
        <Logout />
      </li>
    </StyledHeaderMenu>
  );
}
 * 
 * 
 * 
 * ! 23. Updating User Data and Password
 * -------------------------------------
 * [code]
 * ------
// >>>
---
function Account() {
  return (
    <>
      <Heading as="h1">Update your account</Heading>

      <Row type="vertical">
        <Heading as="h3">Update user data</Heading>
        <UpdateUserDataForm />                              // >>> 1
      </Row>

      <Row type="vertical">
        <Heading as="h3">Update password</Heading>
        <UpdatePasswordForm />                              // >>> 2
      </Row>
    </>
  );
}
---------------------------- CONNECTED ----------------------------
// >>> 1. UpdateUserDataForm
---
function UpdateUserDataForm() {
  // - We don't need the loading state, and can immediately use the user data, because we know that it has already been loaded at this point
  const {
    user: {
      email,
      user_metadata: { fullName: currentFullName },
    },
  } = useLoggedInUser();

  const { updateUserFn, isUpdating } = useUpdateUser();

  const [fullName, setFullName] = useState(currentFullName);
  const [avatar, setAvatar] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!fullName) return;

    updateUserFn(
      { fullName, avatar },
      {
        onSuccess: function () {
          setAvatar(null);
          e.target.reset();
        },
      }
    );
  }
  function handleCancel() {
    setFullName(currentFullName);
    setAvatar(null);
  }
  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="Full name">
        <Input
          type="text"
          id="fullName"
          disabled={isUpdating}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </FormRow>
      <FormRow label="Avatar image">
        <FileInput
          id="avatar"
          accept="image/*"
          type="file"
          disabled={isUpdating}
          onChange={(e) => setAvatar(e.target.files[0])}
        />
      </FormRow>
      <FormRow>
        <Button
          type="reset"
          variation="secondary"
          disabled={isUpdating}
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button disabled={isUpdating}>Update account</Button>
      </FormRow>
    </Form>
  );
}
---------------------------- CONNECTED ----------------------------
// >>> 2. UpdatePasswordForm
---
function UpdatePasswordForm() {
  const { register, handleSubmit, formState, getValues, reset } = useForm(); // - reset: resets every error messages
  const { errors } = formState;

  const { updateUserFn, isUpdating } = useUpdateUser();

  function onSubmit({ password }) {
    updateUserFn({ password }, { onSuccess: reset });
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        label="New Password (min 8 characters)"
        error={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          disabled={isUpdating}
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password needs a minimum of 8 characters",
            },
          })}
        />
      </FormRow>
      <FormRow
        label="Confirm password"
        error={errors?.passwordConfirm?.message}
      >
        <Input
          type="password"
          autoComplete="new-password"
          id="passwordConfirm"
          disabled={isUpdating}
          {...register("passwordConfirm", {
            required: "This field is required",
            validate: (value) =>
              getValues().password === value || "Passwords need to match",
          })}
        />
      </FormRow>
      <FormRow>
        <Button onClick={reset} type="reset" variation="secondary">
          Cancel
        </Button>
        <Button disabled={isUpdating}>Update password</Button>
      </FormRow>
    </Form>
  );
}
---------------------------- CONNECTED ---------------------------- 
// >>> updateCurrentUser
---
export async function updateCurrentUser({ password, fullName, avatar }) {
  // - 1. UPDATE fullName OR password [can't update fullName and password at a time]
  let updateData;
  if (password) updateData = { password: password };                // - either one of (password OR fullName) are true
  if (fullName) updateData = { data: { fullName: fullName } };

  const { data: updateUserData, error: errorWithUpdateUser } =
    await supabase.auth.updateUser(updateData);                     // - this knows which user is currently logged-in [we need to pass in an obj >>> for every field that needs to be updated]

  if (errorWithUpdateUser) {
    throw new Error(errorWithUpdateUser.message);
  }
  if (!avatar) return updateUserData;

  // - 2. UPLOAD avatar image
  // #1 [more details - below]
  const fileName = `avatar-${updateUserData.user.id}-${Math.random()}`; // - making "avatar" unique!  [meanwhile create-policy for avatar inside supabase] 

  const hasImage = updateUserData.user.user_metadata.avatar;
  // console.log(hasImage);

  if (hasImage) {
    const existingFilePath = updateUserData.user.user_metadata.avatar       // - checking if there is another image or not
      .split("/")
      ?.at(-1);

    const { data: imageDeleteData, error: imageDeleteError } =
      await supabase.storage.from("avatars").remove([existingFilePath]);        // - removing existing image and replacing it with new image

    if (imageDeleteError) throw new Error(imageDeleteError.message);
    // console.log("Deleted image ", imageDeleteData);
  }
  const { error: errorWithStorage } = await supabase.storage        // - UPLOADING new image [by replacing older]
    .from("avatars")
    .upload(fileName, avatar);

  if (errorWithStorage) {
    throw new Error(errorWithStorage.message);
  }
  // - 3. UPDATE avatar in user DB details
  const { data: updatedUserAvatarData, error: errorWithUpdateUserAvatar } =
    await supabase.auth.updateUser({
      data: {
        avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,      // - update user details so that those details reflect inside application
      },
    });
  if (errorWithUpdateUserAvatar) {
    throw new Error(errorWithUpdateUserAvatar.message);
  }
  return updatedUserAvatarData;
}
---------------------------- CONNECTED ----------------------------
// >>> useUpdateUser
---
function useUpdateUser() {
  const queryClient = useQueryClient();
  const { mutate: updateUserFn, isLoading: isUpdating } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: function ({ user }) {
      toast.success("User account successfully updated!");
      queryClient.setQueryData(["user"], user);             // - even though we update user in DB but we need to refresh query-cache 
    },
  });
  return { updateUserFn, isUpdating };
}
 * 
 * >>> avatar [supabase-storage-policies]
 * ---
 * #1 create policy for "avatar"
 *      - inside supabase => navigate to "storage" => click on "policies" => click "new policy" 
 *      - create "full customization" policy  
 *          - Policy Name           => "All access for auth users"
 *          - Allowed Operation     => select every option [SELECT, INSERT, UPDATE, DELETE]
 *          - Target Roles          => change it to "authenticated"
 * 
 * 
 * ! 24. Implementing Dark Mode With CSS Variables
 * -----------------------------------------------
 * [code]
 * ------
// >>> DarkModeToggle.jsx
---
function DarkModeToggle() {
  return (
    <ButtonIcon>
      <HiOutlineMoon />
    </ButtonIcon>
  );
}
---------------------------- CONNECTED ----------------------------
// >>> HeaderMenu.jsx
---
function HeaderMenu() {
  const navigate = useNavigate();
  return (
    <StyledHeaderMenu>
      <li>
        <ButtonIcon onClick={() => navigate("/account")}>
          <HiOutlineUser />
        </ButtonIcon>
      </li>
      <li>
        <DarkModeToggle />
      </li>
      <li>
        <Logout />
      </li>
    </StyledHeaderMenu>
  );
}
 * 
 * - now we need to know whether DARK-MODE has applied or not from every page / route of the application
 *      - after knowing.. we need to toggle DARK-MODE button and change it to "LIGHT-MODE" button 
 * [now, we need to know the light/dark state of entire application]!
 * 
 * - to listen to the state of entire application.. we need the help of global state
 *      - global state is only computed with "CONTEXT-API"
 * [context-api has to be placed inside "App.jsx"]
 * 
 * 
 * 
 * 
// >>> DarkModeProvider.jsx
---
// - creating context
const DarkModeContext = createContext();

// - providing context to children
function DarkModeProvider({ children }) {
  const [isDark, setIsDark] = useLocalStorageState(false, "isDark"); //

  useEffect(        // - as we are interacting with DOM.. we use "useEffect" [a-side-effect]
    function () {
      if (isDark) {
        document.documentElement.classList.add("dark-mode");
        document.documentElement.classList.remove("light-mode");
      } else {
        document.documentElement.classList.remove("dark-mode");
        document.documentElement.classList.add("light-mode");
      }
    },
    [isDark]
  );
  function toggleDarkLight() {
    setIsDark((isDark) => !isDark);     // - "onClick" changes toggles >>> [dark -> light] & [light -> dark] 
  }
  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkLight }}>      // - providing "function" and "state" to children components
      {children}
    </DarkModeContext.Provider>
  );
}

// - useContext to provide context 
function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error(
      "Dark-Mode-Context was used outside of Dark-Mode-Provider!"
    );
  }
  return context;
}
export { DarkModeProvider, useDarkMode };
---------------------------- CONNECTED ----------------------------
// >>> App.jsx
---
function App() {
  return (
    <DarkModeProvider>
        ...children...
    </DarkModeProvider>
  )
}
---------------------------- CONNECTED ----------------------------
// >>> DarkModeToggle.jsx
---
function DarkModeToggle() {
  const { isDark, toggleDarkLight } = useDarkMode();
  return (
    <ButtonIcon onClick={toggleDarkLight}>              // - button-click changes dark -> light and vice-versa
      {isDark ? <HiOutlineSun /> : <HiOutlineMoon />}
    </ButtonIcon>                                   \
  );                                    // - also changes the "Icon"
}
---------------------------- CONNECTED ----------------------------
// >>> Logo.jsx
---
function Logo() {
  const { isDark } = useDarkMode();
  const src = isDark ? "/logo-dark.png" : "/logo-light.png";
  return (
    <StyledLogo>
      <Img src={src} alt="Logo" />
    </StyledLogo>
  );
}
 * 
 * 
 * 
 * ! 25. Building the Dashboard Layout
 * -----------------------------------
 * >>> DASHBOARD
 * - The initial app screen should be a dashboard, to display important information for the last 7, 30, or 90 days:
 *      - A list of guests checking in and out on the current day. Users should be able to perform these tasks from here
 *      - Statistics on recent bookings, sales, check ins, and occupancy rate
 *      - A chart showing all daily hotel sales, showing both "total" sales and "extras" sales (only breakfast at the moment)
 *      - A chart showing statistics on stay durations, as this is an important metric for the hotel
 * [code]
 * ------
// >>> DashboardLayout.jsx
----
function DashboardLayout() {
  return (
    <StyledDashboardLayout>
      <div>Statistics</div>
      <div>{"Today's activity"}</div>
      <div>Chat stay durations</div>
      <div>Chart sales</div>
    </StyledDashboardLayout>
  );
}
---------------------------- CONNECTED ----------------------------
// >>> Dashboard.jsx
---
function Dashboard() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Dashboard</Heading>
        <DashboardFilter />                                 // - "filters" >>> filtering data for 7, 30, 90 days
      </Row>
      <DashboardLayout />
    </>
  );
}
---------------------------- CONNECTED ----------------------------
// >>> DashboardFilter.jsx
---
function DashboardFilter() {
  return (
    <Filter
      filterField="last"
      options={[
        { value: "7", label: "Last 7 days" },
        { value: "30", label: "Last 30 days" },
        { value: "90", label: "Last 90 days" },
      ]}
    />
  );
}
 * 
 * - computing necessary data to render on "dashboard"
 * 
 * 
 * ! 26. Computing Recent Bookings and Stays
 * -----------------------------------------
 * >>> distinguish types of data [bookings, stays]
 * [bookings]
 *      - these are sales 
 * ex: where guests may book cabins/rooms >>> 30 days before and they arrive on their selected date of check-in
 * 
 * [stays]
 *      - actual check-ins of guests 
 *      - identify stays by their start date with status of check-in (OR) check-out 
 * ex: as they arrive for their bookings
 * 
 * - calculations of statistics [BOOKINGS, STAYS]
 * [code]
 * ------
// >>> apiBookings.js 
---
1.
export async function getBookingsAfterDate(date) {      // - IMP: 'date' has to be "ISOString"
  const { data, error } = await supabase
    .from("bookings")                                   
    .select("created_at, totalPrice, extrasPrice")          // - query "bookings"
    .gte("created_at", date)                                                        // - gte: after specific date 
    .lte("created_at", getToday({ end: true }));            // - less than: today >>> which is from "a-specific-date" to "today"

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}
// - getToday: which is a function from "utils/helpers.js"

2.
export async function getStaysAfterDate(date) {     // - this fn is for bookings after a specific date
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}
 * 
 * - use these two functions 
 *      - and also REACT-QUERY to get data into application-cache
 * [code]
 * ------
// >>> 1. useRecentBookings.js
---
function useRecentBookings() {
  const [searchParams] = useSearchParams();

  const numDays = !searchParams.get("last") // - 'filterField': "last"
    ? 7
    : Number(searchParams.get("last"));

  // - calculate: we need a date that was 7/30/90 days ago
  const queryDate = subDays(new Date(), numDays).toISOString(); // - we subtract numDays from today (new Date()) and convert that into ISO String

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["bookings", `last-${numDays}`], // - works like a dependency array
    queryFn: function () {
      return getBookingsAfterDate(queryDate); // - function from apiBookings
    },
  });
  return { bookings, isLoading };
}
--------------------------------------------------------------------------------
// >>> 2. useRecentStays.js
---
function useRecentStays() {
  const [searchParams] = useSearchParams();

  const numDays = !searchParams.get("last") // - 'filterField': "last"
    ? 7
    : Number(searchParams.get("last"));

  // - calculate: we need a date that was 7/30/90 days ago
  const queryDate = subDays(new Date(), numDays).toISOString(); // - we subtract numDays from today (new Date()) and convert that into ISO String

  const { data: stays, isLoading } = useQuery({
    queryKey: ["bookings", `last-${numDays}`], // - works like a dependency array
    queryFn: function () {
      return getStaysAfterDate(queryDate); // - function from apiBookings
    },
  });
  // - FILTER
  const confirmedStays = stays?.filter(
    (stay) => stay.status === "checked-in" || stay.status === "checked-out"     // - filtering out only confirmed stays
  );
  return { stays, confirmedStays, isLoading };
}
export default useRecentStays;
---------------------------------------- CONNECTED ----------------------------------------
// >>> [1+2] DashboardLayout
---
function DashboardLayout() {
  const { bookings, isLoading: isBookingsLoading } = useRecentBookings();
  const { stays, confirmedStays, isLoading: isStaysLoading } = useRecentStays();    // - importing data from "useRecentBookings" & "useRecentStays"

  if (isBookingsLoading || isStaysLoading) return <Spinner />;

  return (
    <StyledDashboardLayout>
      <div>Statistics</div>
      <div>{"Today's activity"}</div>
      <div>Chat stay durations</div>
      <div>Chart sales</div>
    </StyledDashboardLayout>
  );
}
 * 
 * - computed values are now displayed accordingly [like statistics: for analysis]
 * inside next lecture // => displaying statistics
 * 
 * 
 * ! 27. Displaying Statistics
 * ---------------------------
 * updated DashboardLayout.jsx file
 * [code]
 * ------
// >>> DashboardLayout
---
function DashboardLayout() {
  const { bookings, isLoading: isBookingsLoading } = useRecentBookings();
  const {
    stays,
    confirmedStays,
    isLoading: isStaysLoading,
    numDays,
  } = useRecentStays();

  // to get total number of cabins
  const { cabins, isLoading: isCabinsLoading } = useFetchCabins();

  if (isBookingsLoading || isStaysLoading || isCabinsLoading)
    return <Spinner />;

  return (
    <StyledDashboardLayout>
      <Stats
        bookings={bookings}
        confirmedStays={confirmedStays}
        numCabins={cabins.length}
        numDays={numDays}
      />
      <div>{"Today's activity"}</div>
      <div>Chat stay durations</div>
      <div>Chart sales</div>
    </StyledDashboardLayout>
  );
}
----------------------------------------- CONNECTED -----------------------------------------
// >>> Stats
---
function Stats({ bookings, confirmedStays, numDays, numCabins }) {
  const numBookings = bookings.length;        // - 1. calculate total number of "bookings"

  const sales = bookings.reduce((acc, cur) => {       // - 2. calc total number of "sales"
    return acc + cur.totalPrice;
  }, 0);

  const checkIns = confirmedStays.length;     // - 3. calc total num of "check-in"

  // - 4. calc: "occupancy-rate" = num of checked-in nights (num of nights guests stayed)! / available nights (num of days * num of cabins)
  const numCheckedInNights = confirmedStays.reduce((acc, cur) => {
    return acc + cur.numNights;
  }, 0);
  const availableNights = numDays * numCabins;
  const occupancyRate = numCheckedInNights / availableNights;

  return (
    <>
      <Stat
        title="Bookings"
        color="blue"
        icon={<HiOutlineBriefcase />}
        value={numBookings}
      />
      <Stat
        title="Sales"
        color="green"
        icon={<HiOutlineBanknotes />}
        value={formatCurrency(sales)}
      />
      <Stat
        title="Check ins"
        color="indigo"
        icon={<HiOutlineCalendarDays />}
        value={checkIns}
      />
      <Stat
        title="Occupancy rate"
        color="yellow"
        icon={<HiOutlineChartBar />}
        value={Math.round(occupancyRate * 100) + "%"}
      />
    </>
  );
}
----------------------------------------- CONNECTED -----------------------------------------
// >>> Stat.jsx
---
function Stat({ icon, title, value, color }) {
  return (
    <StyledStat>
      <Icon color={color}>{icon}</Icon>
      <Title>{title}</Title>
      <Value>{value}</Value>
    </StyledStat>
  );
}
 * 
 * 
 * 
 * ! 28. Displaying a Line Chart With the Recharts Library
 * -------------------------------------------------------
 * popular, easiest and most-used react charts: "RECHARTS"
 * => npm i recharts@2
 * 
 * [code]
 * ------
// >>> SalesChart.jsx:
---
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDarkMode } from "../../context/DarkModeContext";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";

function SalesChart({ bookings, numDays }) {
  const { isDark } = useDarkMode();

  const allDates = eachDayOfInterval({
    start: subDays(new Date(), numDays - 1),
    end: new Date(),
  });
  const data = allDates.map((date) => {
    return {
      label: format(date, "MMM dd"),
      totalSales: bookings
        .filter((booking) => {
          return isSameDay(date, new Date(booking.created_at));
        })
        .reduce((acc, cur) => {
          return acc + cur.totalPrice;
        }, 0),

      extrasSales: bookings
        .filter((booking) => {
          return isSameDay(date, new Date(booking.created_at));
        })
        .reduce((acc, cur) => {
          return acc + cur.extrasPrice;
        }, 0),
    };
  });
  const colors = isDark
    ? {
        totalSales: { stroke: "#4f46e5", fill: "#4f46e5" },
        extrasSales: { stroke: "#22c55e", fill: "#22c55e" },
        text: "#e5e7eb",
        background: "#18212f",
      }
    : {
        totalSales: { stroke: "#4f46e5", fill: "#c7d2fe" },
        extrasSales: { stroke: "#16a34a", fill: "#dcfce7" },
        text: "#374151",
        background: "#fff",
      };
  return (
    <StyledSalesChart>
      <Heading as="h2">
        Sales from {format(allDates.at(0), "dd MMM yyyy")} &mdash;{" "}
        {format(allDates.at(-1), "dd MMM yyyy")}
      </Heading>
      <ResponsiveContainer height={300} width="100%">
        <AreaChart data={data}>
          <XAxis
            dataKey="label"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <YAxis
            unit="$"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <CartesianGrid strokeDasharray="4" />
          <Tooltip contentStyle={{ backgroundColor: colors.background }} />
          <Area
            dataKey="totalSales"
            type="monotone"
            stroke={colors.totalSales.stroke}
            fill={colors.totalSales.fill}
            strokeWidth={2}
            name="Total sales"
            unit="$"
          />
          <Area
            dataKey="extrasSales"
            type="monotone"
            stroke={colors.extrasSales.stroke}
            fill={colors.extrasSales.fill}
            strokeWidth={2}
            name="Extras sales"
            unit="$"
          />
        </AreaChart>
      </ResponsiveContainer>
    </StyledSalesChart>
  );
}
------------------------------------------------------ CONNECTED ------------------------------------------------------
// >>> DashboardLayout.jsx
---
function DashboardLayout() {
  const { bookings, isLoading: isBookingsLoading } = useRecentBookings();
  const {
    stays,
    confirmedStays,
    isLoading: isStaysLoading,
    numDays,
  } = useRecentStays();

  const { cabins, isLoading: isCabinsLoading } = useFetchCabins();

  if (isBookingsLoading || isStaysLoading || isCabinsLoading)
    return <Spinner />;

  return (
    <StyledDashboardLayout>
      <Stats ... />
      <div>{"Today's activity"}</div>
      <div>Chat stay durations</div>
      <SalesChart bookings={bookings} numDays={numDays} />    // - included "SalesChart" here
    </StyledDashboardLayout>
  );
}
 * 
 * 
 * ! 29. Displaying a Pie Chart
 * ----------------------------
 * [code]
 * ------
// >>> DurationChart.jsx
---
const startDataLight = [
  {
    duration: "1 night",
    value: 0,
    color: "#ef4444",
  },
  {
    duration: "2 nights",
    value: 0,
    color: "#f97316",
  },
  {
    duration: "3 nights",
    value: 0,
    color: "#eab308",
  },
  {
    duration: "4-5 nights",
    value: 0,
    color: "#84cc16",
  },
  {
    duration: "6-7 nights",
    value: 0,
    color: "#22c55e",
  },
  {
    duration: "8-14 nights",
    value: 0,
    color: "#14b8a6",
  },
  {
    duration: "15-21 nights",
    value: 0,
    color: "#3b82f6",
  },
  {
    duration: "21+ nights",
    value: 0,
    color: "#a855f7",
  },
];
--------------------------------------------------------------------
const startDataDark = [
  {
    duration: "1 night",
    value: 0,
    color: "#b91c1c",
  },
  {
    duration: "2 nights",
    value: 0,
    color: "#c2410c",
  },
  {
    duration: "3 nights",
    value: 0,
    color: "#a16207",
  },
  {
    duration: "4-5 nights",
    value: 0,
    color: "#4d7c0f",
  },
  {
    duration: "6-7 nights",
    value: 0,
    color: "#15803d",
  },
  {
    duration: "8-14 nights",
    value: 0,
    color: "#0f766e",
  },
  {
    duration: "15-21 nights",
    value: 0,
    color: "#1d4ed8",
  },
  {
    duration: "21+ nights",
    value: 0,
    color: "#7e22ce",
  },
];
--------------------------------------------------------------------
function prepareData(startData, stays) {
  // - A bit ugly code, but sometimes this is what it takes when working with real data 😅
  function incArrayValue(arr, field) {
    return arr.map((obj) =>
      obj.duration === field ? { ...obj, value: obj.value + 1 } : obj
    );
  }
  const data = stays
    .reduce((arr, cur) => {
      const num = cur.numNights;
      if (num === 1) return incArrayValue(arr, "1 night");
      if (num === 2) return incArrayValue(arr, "2 nights");
      if (num === 3) return incArrayValue(arr, "3 nights");
      if ([4, 5].includes(num)) return incArrayValue(arr, "4-5 nights");
      if ([6, 7].includes(num)) return incArrayValue(arr, "6-7 nights");
      if (num >= 8 && num <= 14) return incArrayValue(arr, "8-14 nights");
      if (num >= 15 && num <= 21) return incArrayValue(arr, "15-21 nights");
      if (num >= 21) return incArrayValue(arr, "21+ nights");
      return arr;
    }, startData)
    .filter((obj) => obj.value > 0);

  return data;
}
--------------------------------------------------------------------
function DurationChart({ confirmedStays }) {
  const { isDark } = useDarkMode();

  const startData = isDark ? startDataDark : startDataLight;
  const data = prepareData(startData, confirmedStays);

  return (
    <ChartBox>
      <Heading as="h2">Stays duration summary</Heading>
      <ResponsiveContainer weight="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            nameKey="duration"
            dataKey="value"
            innerRadius={80}
            outerRadius={115}
            paddingAngle={4}
            cx="40%"
            cy="50%"
          >
            {data.map((entry) => (
              <Cell
                fill={entry.color}
                stroke={entry.color}
                key={entry.duration}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            verticalAlign="middle"
            align="right"
            width="30%"
            layout="vertical"
            iconSize={14}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartBox>
  );
}
------------------------ CONNECTED ------------------------
// >>> DashboardLayout.jsx
---
return (
  <StyledDashboardLayout>
    <Stats
      bookings={bookings}
      confirmedStays={confirmedStays}
      numCabins={cabins.length}
      numDays={numDays}
    />
    <div>{"Today's activity"}</div>
    <DurationChart confirmedStays={confirmedStays} />
    <SalesChart bookings={bookings} numDays={numDays} />
  </StyledDashboardLayout>
);
 * 
 * 
 * 
 * ! 30. Displaying Stays for Current Day
 * --------------------------------------
 * [code]
 * ------
// >>> apiBookings.js
---
// - Activity means that there is a check-in (OR) check-out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order("created_at");

  // CONDITIONS
  // ? (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // ? (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))
    
  // - Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // - if we want to apply above conditions to "bookings" data.. then we need to download data that is related to "bookings"
  // - so, instead we used "supabase" queries.. so that we get data with applied conditionals

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}
 * 
 * - this data has to be queried again and has to be stored inside "cache" using react-query
 * [react-query]  
 * -------------
// >>> useTodayActivity.js:
---
function useTodayActivity() {
  const { data: todayStays, isLoading: isLoadingTodayActivity } = useQuery({
    queryKey: ["today-activity"],
    queryFn: getStaysTodayActivity,
  });

  return { todayStays, isLoadingTodayActivity };
}
 * 
 * - using data to render content 
 * [JSX-CODE]
 * ----------
// >>> TodayActivity.jsx
---

function TodayActivity() {
  const { activitiesToday, isLoadingTodayActivity } = useTodayActivity();

  return (
    <StyledToday>
      <Row type="horizontal">
        <Heading as="h2">Today</Heading>
      </Row>
      {!isLoadingTodayActivity ? (
        activitiesToday?.length > 0 ? (
          <ActivityList>
            {activitiesToday.map((activity) => (
              <TodayItem key={activity.id} activity={activity} />   // - sending data as props into "TodayItem" component
            ))}
          </ActivityList>
        ) : (
          <NoActivity>No activity for today!</NoActivity>
        )
      ) : (
        <Spinner />
      )}
    </StyledToday>
  );
}
------------------------------- CONNECTED -------------------------------
// >>> TodayItem.jsx
---
function TodayItem({ activity }) {
  const { id, status, guests, numNights } = activity;

  return (
    <StyledTodayItem>
      {status === "unconfirmed" ? <Tag type="green">Arriving</Tag> : ""}
      {status === "checked-in" ? <Tag type="blue">Departing</Tag> : ""}
      <Flag src={guests.countryFlag} alt={`Flag of ${guests.country}`} />
      <Guest>{guests.fullName}</Guest>
      <div>{numNights} nights</div>

      {status === "unconfirmed" && (
        <Button
          size="small"
          variation="primary" 
          as={Link}               // #1
          to={`/checkin/${id}`}
        >
          Check in
        </Button>
      )}
      {status === "checked-in" ? <CheckoutButton bookingId={id} /> : ""}
    </StyledTodayItem>
  );
}
------------------------------- CONNECTED -------------------------------
// >>> CheckoutButton.jsx
---
function CheckoutButton({ bookingId }) {
  const { checkout, isCheckingOut } = useCheckout();

  return (
    <Button
      size="small"
      variation="primary"
      disabled={isCheckingOut}
      onClick={() => checkout(bookingId)}
    >
      Check out
    </Button>
  );
}
 * 
 * [explanation]
 * #1
 * - used "as" inside a button component 
 *    - "as" replaces actual HTML element >>> with passed HTML element into it 
 *    - that is why we defined "to" to specify link which takes user to that link
 * 
 * 
 * ! 31. Error Boundaries
 * ----------------------
 * (how to handle errors that might occur during react rendering)
 * * Error Boundaries
 *    - these are try-catch blocks but for react-rendering
 * (hard to use in react: they're still implemented using class components)
 * 
 * >>> so, use package called "react error boundary"
 * => npm i react-error-boundary
 * 
 * - this package provides us with error-boundary-component 
 * [where we can pass in a fallback and also a function to reset the application (that is whenever an error has been occurred)] 
 * 
 * [error]
 * -------
// >>> inside BookingTable.jsx
---
function BookingTable() {
  const { bookings, isLoading, count } = useFetchBookings();
  if (isLoading) return <Spinner />;
  if (bookings?.length === 0) return <Empty resourceName="Bookings" />;
  
  return ( ... )
}
 * 
 * >>> steps:
 * - wrap <App /> inside "main.jsx" into "ErrorBoundary" from the package that we just installed!
 *    - it takes a property "FallbackComponent" >>> this takes a component not an element 
 * [code]
 * ------
// >>> inside main.jsx
---
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={() => window.location.replace("/")}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
--------------------------------- CONNECTED ---------------------------------
// >>> ErrorFallback.jsx (created a component)
---
function ErrorFallback({ error, resetErrorBoundary }) {           // - this component will render when an error occurred!
  return (
    <>
      <GlobalStyles />
      <StyledErrorFallback>
        <Box>
          <Heading as="h1">Something went wrong!</Heading>
          <p>{error?.message}</p>
          <Button size="large" onClick={resetErrorBoundary}>Try again</Button>
        </Box>
      </StyledErrorFallback>
    </>
  );
}
 * 
 * $ SUMMARY
 * - these error boundaries only catch errors while react is rendering 
 * - and errors occurred inside event handlers, in an effect and in asynchronous code are not caught by this error boundary
 * 
 * ! 32. Final Touches + Fixing Bugs
 * ---------------------------------
 * #1 an error inside "Menus.jsx"
 *    - for every menu on every row whenever we click on that vertical-three dots 
 * [it opens on first-click and has to close again on clicking that same 3-dots again >>> but it is not happening!]
 *    - after opened, and again clicking on same button recognize that as "Outside-Click" 
 *    [but it recognize outside click and then in milliseconds it will be clicked automatically]
 * [CAUSE]
 *    - event BUBBLING and CAPTURING phases and stop the event propagation also
 *    [set it to false, it will be true (if we haven't specified!)]
 * 
 * * e.stopPropagation
 *    - using this event will never travel up inside DOM
 * 
 * [code]
 * ------
// >>> Menus.jsx
---
const MenusContext = createContext();
function Menus({ children }) {
  const [openId, setOpenId] = useState("");
  const [position, setPosition] = useState(null);

  function close() {
    setOpenId("");
  }
  const open = setOpenId;
  
  return (
    <MenusContext.Provider
      value={{ openId, open, close, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
}

function Toggle({ id }) {
  const { openId, open, close, setPosition } = useContext(MenusContext);

  function handleClick(e) {
    e.stopPropagation()                                                       // - [ADDITIONALLY] stop default event-propagation here

    const rect = e.target.closest("button").getBoundingClientRect();
    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    });
    openId === "" || openId !== id ? open(id) : close();
  }
  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}
function List({ id, children }) {
  const { openId, position, close } = useContext(MenusContext);

  const { ref } = useOutsideClick(close, false);      // - specify 'false' here [CONNECTION-BELOW: useOutsideClick]

  if (openId === id) {
    return createPortal(
      <StyledList position={position} ref={ref}>
        {children}
      </StyledList>,
      document.body
    );
  }
}
function Button({ children, icon, onClick }) {
  const { close } = useContext(MenusContext);

  function handleClick() {
    onClick?.();
    close();
  }
  return (
    <li>
      <StyledButton onClick={handleClick}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}
Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;
---------------------------------------- CONNECTED ----------------------------------------
// >>> useOutsideClick
---
function useOutsideClick(closeHandler, listenCapturing = true) {
  const ref = useRef();
  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          closeHandler();
        }
      }                                               // - this lies here to remove immediately
      document.addEventListener("click", handleClick, listenCapturing);                           // - event capturing phase
                                                                      
      return function () {
        document.removeEventListener("click", handleClick, listenCapturing);
      };                                                                    // - when comp "un-mounts" remove "handleClick" function
    },
    [closeHandler, listenCapturing]
  );
  return { ref };
}
 *    
 * 
 * #2 ERROR fixing
 *    - when user wants to fetch booking with booking-id that was not inside DB
 *      - booking-id that does not exist
 * (this error may get caught with error boundary but we have to render a message that "booking could not be found!")
 * [code]
 * ------
// >>> BookingDetail
---
function BookingDetail() {
  const navigate = useNavigate();
  const { booking, isLoading } = useFetchBooking();
  const { checkout, isCheckingOut } = useCheckout();
  const { deleteBooking, isDeleting } = useDeleteBooking();
  const moveBack = useMoveBack();

  if (isLoading) return <Spinner />;
  if (!booking) return <Empty resourceName={booking} />;

  const { status, id: bookingId } = booking;

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  return ( 
    --- CHECK ON GITHUB ---
  )
}
-------------------- CONNECTED --------------------
// >>> Empty
---
function Empty({ resourceName }) {
  return <p>No {resourceName} could be found.</p>;
}
export default Empty;
 * 
 * #3 FEATURE
 *    - using default value for "isDark" value from user-defined setting inside user's operating system
 * that is done using...
 *  - media query: window.matchMedia('(prefers-color-scheme: dark)').matches
 *    - with this whenever users open application it will be in "dark-mode"
 * [code]
 * ------
// >>> 
---
function DarkModeProvider({ children }) {
  const [isDark, setIsDark] = useLocalStorageState(
    window.matchMedia("(prefers-color-scheme: dark)").matches,    // - user's OPERATING SYSTEM's setting
    "isDark"
  ); 
  useEffect(
    function () {
      if (isDark) {
        document.documentElement.classList.add("dark-mode");
        document.documentElement.classList.remove("light-mode");
      } else {
        document.documentElement.classList.remove("dark-mode");
        document.documentElement.classList.add("light-mode");
      }
    },
    [isDark]
  );
  function toggleDarkLight() {
    setIsDark((isDark) => !isDark);
  }
  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkLight }}>
      {children}
    </DarkModeContext.Provider>
  );
}
function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error(
      "Dark-Mode-Context was used outside of Dark-Mode-Provider!"
    );
  }
  return context;
}
export { DarkModeProvider, useDarkMode };
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
