import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let emergencyContacts = Map.empty<Nat, ThozhiContact>();
  let dietEntries = Map.empty<Nat, ThozhiDietEntry>();
  let firstAidEntries = Map.empty<Nat, ThozhiFirstAidEntry>();
  let workoutEntries = Map.empty<Nat, ThozhiWorkoutEntry>();
  let localServices = Map.empty<Nat, ThozhiLocalService>();
  let userProfiles = Map.empty<Principal, ThozhiUserProfile>();

  var emergencyContactIdCounter = 1;
  var dietEntryIdCounter = 21;
  var firstAidEntryIdCounter = 11;
  var workoutEntryIdCounter = 1;
  var localServiceIdCounter = 1;
  var isInitialized = false;

  type ThozhiContact = {
    id : Nat;
    userId : Principal;
    name : Text;
    phone : Text;
    relation : Text;
    isDefault : Bool;
  };

  module ThozhiContact {
    public func compareType(a : ThozhiContact, b : ThozhiContact) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  type ThozhiDietEntry = {
    id : Nat;
    category : Text;
    title : Text;
    description : Text;
    isPreloaded : Bool;
    createdBy : ?Principal;
  };

  module ThozhiDietEntry {
    public func compareType(a : ThozhiDietEntry, b : ThozhiDietEntry) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  type ThozhiFirstAidEntry = {
    id : Nat;
    situation : Text;
    steps : [Text];
    isPreloaded : Bool;
    createdBy : ?Principal;
  };

  module ThozhiFirstAidEntry {
    public func compareType(a : ThozhiFirstAidEntry, b : ThozhiFirstAidEntry) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  type ThozhiWorkoutEntry = {
    id : Nat;
    category : Text;
    title : Text;
    description : Text;
    duration : Text;
    difficulty : Text;
  };

  module ThozhiWorkoutEntry {
    public func compareType(a : ThozhiWorkoutEntry, b : ThozhiWorkoutEntry) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  type ThozhiLocalService = {
    id : Nat;
    name : Text;
    type_ : Text;
    address : Text;
    phone : Text;
    district : Text;
  };

  module ThozhiLocalService {
    public func compareType(a : ThozhiLocalService, b : ThozhiLocalService) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  type ThozhiUserProfile = {
    name : Text;
    age : Nat;
    healthCondition : Text;
  };

  module ThozhiUserProfile {
    public func compareType(a : ThozhiUserProfile, b : ThozhiUserProfile) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public query ({ caller }) func getContacts() : async [ThozhiContact] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view contacts");
    };

    let contacts = List.empty<ThozhiContact>();
    contacts.add({
      id = 0;
      userId = caller;
      name = "Police";
      phone = "100";
      relation = "Police";
      isDefault = true;
    });

    let userContacts = emergencyContacts.values().filter(
      func(c) {
        c.userId == caller;
      }
    );
    contacts.addAll(userContacts);

    contacts.toArray().sort(ThozhiContact.compareType);
  };

  public shared ({ caller }) func addContact(name : Text, phone : Text, relation : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add contacts");
    };

    let filteredContacts = emergencyContacts.filter(
      func(_, contact) { contact.userId == caller }
    );
    if (filteredContacts.size() >= 5) {
      Runtime.trap("Maximum contacts reached");
    };

    let newContact : ThozhiContact = {
      id = emergencyContactIdCounter;
      userId = caller;
      name;
      phone;
      relation;
      isDefault = false;
    };

    emergencyContacts.add(emergencyContactIdCounter, newContact);
    emergencyContactIdCounter += 1;
    newContact.id;
  };

  public query ({ caller }) func getDietEntriesByCategory(category : Text) : async [ThozhiDietEntry] {
    let entries = dietEntries.values().filter(
      func(entry) { Text.equal(entry.category, category) }
    );
    entries.toArray().sort(ThozhiDietEntry.compareType);
  };

  public query ({ caller }) func getFirstAidEntries() : async [ThozhiFirstAidEntry] {
    firstAidEntries.values().toArray().sort(ThozhiFirstAidEntry.compareType);
  };

  public query ({ caller }) func getWorkoutsByCategory(category : Text) : async [ThozhiWorkoutEntry] {
    let workouts = workoutEntries.values().filter(
      func(workout) { Text.equal(workout.category, category) }
    );
    workouts.toArray().sort(ThozhiWorkoutEntry.compareType);
  };

  public query ({ caller }) func getServicesByType(type_ : Text) : async [ThozhiLocalService] {
    let services = localServices.values().filter(
      func(service) { Text.equal(service.type_, type_) }
    );
    services.toArray().sort(ThozhiLocalService.compareType);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?ThozhiUserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?ThozhiUserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : ThozhiUserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func updateUserProfile(name : Text, age : Nat, healthCondition : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };
    let profile : ThozhiUserProfile = {
      name;
      age;
      healthCondition;
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func initialize() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can initialize the system");
    };
    if (isInitialized) {
      Runtime.trap("System already initialized");
    };

    let policeContact : ThozhiContact = {
      id = 0;
      userId = caller;
      name = "Police";
      phone = "100";
      relation = "Police";
      isDefault = true;
    };

    emergencyContacts.add(0, policeContact);

    // Period Wellness entries (IDs 13–20)
    let periodTips : [ThozhiDietEntry] = [
      {
        id = 13;
        category = "menstrual";
        title = "🥗 Foods to Eat During Periods";
        description = "Iron-rich foods (to prevent weakness): Spinach, beetroot, dates, jaggery (vellam), pomegranate. Warm and comforting foods: Soups, dal, khichdi, warm milk. Fruits for energy: Banana (reduces cramps), apple, orange. Healthy fats: Nuts (almonds, walnuts), seeds (flax, sunflower). Magnesium-rich foods: Dark chocolate (small amount), leafy greens. Protein sources: Eggs, paneer, lentils, chickpeas.";
        isPreloaded = true;
        createdBy = null;
      },
      {
        id = 14;
        category = "menstrual";
        title = "🚫 Foods to Avoid During Periods";
        description = "Junk food and deep-fried items. Too much caffeine (coffee/tea) — increases cramps. Cold drinks and ice cream (may worsen discomfort). Excess salt — causes bloating.";
        isPreloaded = true;
        createdBy = null;
      },
      {
        id = 15;
        category = "menstrual";
        title = "💧 Hydration Tips for Periods";
        description = "Drink 7–10 glasses of water daily. Try warm water instead of cold. Herbal teas (ginger tea, chamomile tea) help reduce pain.";
        isPreloaded = true;
        createdBy = null;
      },
      {
        id = 16;
        category = "menstrual";
        title = "🧘‍♀️ Easy Workouts & Movements";
        description = "Light yoga (10–15 mins): Child&#x27;s pose, Cat-cow stretch, Cobra pose. Walking: 10–20 minutes slow walk daily. Stretching: Gentle lower back and leg stretches. Breathing exercises: Deep breathing reduces pain and stress. Avoid heavy workouts or intense gym sessions.";
        isPreloaded = true;
        createdBy = null;
      },
      {
        id = 17;
        category = "menstrual";
        title = "🌿 Natural Pain Relief Tips";
        description = "Use a heating pad on your lower abdomen. Take a warm bath. Light massage with coconut or lavender oil. Maintain good sleep (7–8 hours).";
        isPreloaded = true;
        createdBy = null;
      },
      {
        id = 18;
        category = "menstrual";
        title = "🧠 Mood & Mental Health Care";
        description = "Hormones may cause mood swings — it&#x27;s normal. Listen to music, watch something relaxing. Avoid stress and overthinking. Talk to someone if you feel low.";
        isPreloaded = true;
        createdBy = null;
      },
      {
        id = 19;
        category = "menstrual";
        title = "📅 Sample Simple Daily Routine";
        description = "Morning: Warm water + light stretching. Breakfast: Banana + oats / eggs. Lunch: Rice + dal + vegetables. Evening: Herbal tea + nuts. Dinner: Light meal (soup/chapati + sabzi). Night: Warm milk + good sleep.";
        isPreloaded = true;
        createdBy = null;
      },
      {
        id = 20;
        category = "menstrual";
        title = "⚠️ When to See a Doctor";
        description = "Very severe pain (not manageable). Extremely heavy bleeding. Irregular cycles frequently.";
        isPreloaded = true;
        createdBy = null;
      },
    ];

    for (tip in periodTips.values()) {
      dietEntries.add(tip.id, tip);
    };

    isInitialized := true;
    dietEntryIdCounter := 21;
  };

  public shared ({ caller }) func createDietEntry(
    category : Text,
    title : Text,
    description : Text,
    isPreloaded : Bool,
    createdBy : ?Principal,
  ) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create diet entries");
    };
    let entry : ThozhiDietEntry = {
      id = dietEntryIdCounter;
      category;
      title;
      description;
      isPreloaded;
      createdBy;
    };
    dietEntries.add(dietEntryIdCounter, entry);
    dietEntryIdCounter += 1;
    entry.id;
  };

  public shared ({ caller }) func addDietEntry(
    category : Text,
    title : Text,
    description : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add diet entries");
    };
    let entry : ThozhiDietEntry = {
      id = dietEntryIdCounter;
      category;
      title;
      description;
      isPreloaded = false;
      createdBy = ?caller;
    };
    dietEntries.add(dietEntryIdCounter, entry);
    dietEntryIdCounter += 1;
    entry.id;
  };

  public shared ({ caller }) func createFirstAidEntry(
    situation : Text,
    steps : [Text],
    isPreloaded : Bool,
    createdBy : ?Principal,
  ) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create first aid entries");
    };
    let entry : ThozhiFirstAidEntry = {
      id = firstAidEntryIdCounter;
      situation;
      steps;
      isPreloaded;
      createdBy;
    };
    firstAidEntries.add(firstAidEntryIdCounter, entry);
    firstAidEntryIdCounter += 1;
    entry.id;
  };

  public shared ({ caller }) func addFirstAidEntry(situation : Text, steps : [Text]) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add first aid entries");
    };
    let entry : ThozhiFirstAidEntry = {
      id = firstAidEntryIdCounter;
      situation;
      steps;
      isPreloaded = false;
      createdBy = ?caller;
    };
    firstAidEntries.add(firstAidEntryIdCounter, entry);
    firstAidEntryIdCounter += 1;
    entry.id;
  };

  public shared ({ caller }) func createWorkoutEntry(
    category : Text,
    title : Text,
    description : Text,
    duration : Text,
    difficulty : Text,
  ) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create workout entries");
    };
    let entry : ThozhiWorkoutEntry = {
      id = workoutEntryIdCounter;
      category;
      title;
      description;
      duration;
      difficulty;
    };
    workoutEntries.add(workoutEntryIdCounter, entry);
    workoutEntryIdCounter += 1;
    entry.id;
  };

  public shared ({ caller }) func createLocalService(
    name : Text,
    type_ : Text,
    address : Text,
    phone : Text,
    district : Text,
  ) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create local services");
    };
    let service : ThozhiLocalService = {
      id = localServiceIdCounter;
      name;
      type_;
      address;
      phone;
      district;
    };
    localServices.add(localServiceIdCounter, service);
    localServiceIdCounter += 1;
    service.id;
  };

  // 1. Only regular users can use this function (not admins) => guard
  // 2. isPreloaded field should always be false for this function
  public shared ({ caller }) func addLocalService(
    name : Text,
    type_ : Text,
    address : Text,
    phone : Text,
    district : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add local services");
    };
    let service : ThozhiLocalService = {
      id = localServiceIdCounter;
      name;
      type_;
      address;
      phone;
      district;
    };
    localServices.add(localServiceIdCounter, service);
    localServiceIdCounter += 1;
    service.id;
  };
};
