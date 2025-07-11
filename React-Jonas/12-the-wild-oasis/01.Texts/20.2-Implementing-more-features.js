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
// >>> [1+2] 
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
 * 
 * 
 * 
 * ! 21. Authorization on Supabase: Protecting Database (RLS)
 * ----------------------------------------------------------
 * 
 * ! 21. Authorization on Supabase: Protecting Database (RLS)
 * ----------------------------------------------------------
 * 
 * ! 21. Authorization on Supabase: Protecting Database (RLS)
 * ----------------------------------------------------------
 * 
 * ! 21. Authorization on Supabase: Protecting Database (RLS)
 * ----------------------------------------------------------
 * 
 * ! 21. Authorization on Supabase: Protecting Database (RLS)
 * ----------------------------------------------------------
 * 
 * ! 21. Authorization on Supabase: Protecting Database (RLS)
 * ----------------------------------------------------------
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
