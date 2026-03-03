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

// Persistent Data Structures
actor {
  let emergencyContacts = Map.empty<Nat, ShaktiCareContact>();
  let dietEntries = Map.empty<Nat, ShaktiCareDietEntry>();
  let firstAidEntries = Map.empty<Nat, ShaktiCareFirstAidEntry>();
  let workoutEntries = Map.empty<Nat, ShaktiCareWorkoutEntry>();
  let localServices = Map.empty<Nat, ShaktiCareLocalService>();
  let userProfiles = Map.empty<Principal, ShaktiCareUserProfile>();

  // Persistent ID counters
  var emergencyContactIdCounter = 1;
  var dietEntryIdCounter = 1;
  var firstAidEntryIdCounter = 1;
  var workoutEntryIdCounter = 1;
  var localServiceIdCounter = 1;

  // Types
  type ShaktiCareContact = {
    id : Nat;
    userId : Principal;
    name : Text;
    phone : Text;
    relation : Text;
    isDefault : Bool;
  };

  module ShaktiCareContact {
    public func compareType(a : ShaktiCareContact, b : ShaktiCareContact) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  type ShaktiCareDietEntry = {
    id : Nat;
    category : Text;
    title : Text;
    description : Text;
    isPreloaded : Bool;
    createdBy : ?Principal;
  };

  module ShaktiCareDietEntry {
    public func compareType(a : ShaktiCareDietEntry, b : ShaktiCareDietEntry) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  type ShaktiCareFirstAidEntry = {
    id : Nat;
    situation : Text;
    steps : [Text];
    isPreloaded : Bool;
    createdBy : ?Principal;
  };

  module ShaktiCareFirstAidEntry {
    public func compareType(a : ShaktiCareFirstAidEntry, b : ShaktiCareFirstAidEntry) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  type ShaktiCareWorkoutEntry = {
    id : Nat;
    category : Text;
    title : Text;
    description : Text;
    duration : Text;
    difficulty : Text;
  };

  module ShaktiCareWorkoutEntry {
    public func compareType(a : ShaktiCareWorkoutEntry, b : ShaktiCareWorkoutEntry) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  type ShaktiCareLocalService = {
    id : Nat;
    name : Text;
    type_ : Text;
    address : Text;
    phone : Text;
    district : Text;
  };

  module ShaktiCareLocalService {
    public func compareType(a : ShaktiCareLocalService, b : ShaktiCareLocalService) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  type ShaktiCareUserProfile = {
    name : Text;
    age : Nat;
    healthCondition : Text;
  };

  module ShaktiCareUserProfile {
    public func compareType(a : ShaktiCareUserProfile, b : ShaktiCareUserProfile) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Emergency Contacts
  public query ({ caller }) func getContacts() : async [ShaktiCareContact] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view contacts");
    };

    let contacts = List.empty<ShaktiCareContact>();
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

    contacts.toArray().sort(ShaktiCareContact.compareType);
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

    let newContact : ShaktiCareContact = {
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

  // Diet Entries (Preloaded Only)
  public query ({ caller }) func getDietEntriesByCategory(category : Text) : async [ShaktiCareDietEntry] {
    let entries = dietEntries.values().filter(
      func(entry) {
        Text.equal(entry.category, category) and entry.isPreloaded;
      }
    );
    entries.toArray().sort(ShaktiCareDietEntry.compareType);
  };

  // First Aid Entries (Preloaded Only)
  public query ({ caller }) func getFirstAidEntries() : async [ShaktiCareFirstAidEntry] {
    let entries = firstAidEntries.values().filter(
      func(entry) { entry.isPreloaded }
    );
    entries.toArray().sort(ShaktiCareFirstAidEntry.compareType);
  };

  // Workouts (Preloaded Only)
  public query ({ caller }) func getWorkoutsByCategory(category : Text) : async [ShaktiCareWorkoutEntry] {
    let workouts = workoutEntries.values().filter(
      func(workout) { Text.equal(workout.category, category) }
    );
    workouts.toArray().sort(ShaktiCareWorkoutEntry.compareType);
  };

  // Local Services (Preloaded Only)
  public query ({ caller }) func getServicesByType(type_ : Text) : async [ShaktiCareLocalService] {
    let services = localServices.values().filter(
      func(service) { Text.equal(service.type_, type_) }
    );
    services.toArray().sort(ShaktiCareLocalService.compareType);
  };

  // User Profile - Required functions per instructions
  public query ({ caller }) func getCallerUserProfile() : async ?ShaktiCareUserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?ShaktiCareUserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : ShaktiCareUserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Legacy function - kept for backward compatibility
  public shared ({ caller }) func updateUserProfile(name : Text, age : Nat, healthCondition : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };
    let profile : ShaktiCareUserProfile = {
      name;
      age;
      healthCondition;
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func initialize() : async () {
    let policeContact : ShaktiCareContact = {
      id = 0;
      userId = caller;
      name = "Police";
      phone = "100";
      relation = "Police";
      isDefault = true;
    };

    emergencyContacts.add(0, policeContact);
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
    let entry : ShaktiCareDietEntry = {
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

  public shared ({ caller }) func createFirstAidEntry(
    situation : Text,
    steps : [Text],
    isPreloaded : Bool,
    createdBy : ?Principal,
  ) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create first aid entries");
    };
    let entry : ShaktiCareFirstAidEntry = {
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
    let entry : ShaktiCareWorkoutEntry = {
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
    let service : ShaktiCareLocalService = {
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
