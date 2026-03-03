import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Loader2, Phone, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAddContact, useContacts } from "../hooks/useQueries";
import { useVoiceAssistant } from "../hooks/useVoiceAssistant";

const DEFAULT_CONTACTS = [
  {
    label: "Police",
    number: "100",
    emoji: "🚔",
    ocid: "sos.police_button",
    color: "bg-destructive",
    description: "Tamil Nadu Police Emergency",
  },
  {
    label: "Ambulance",
    number: "108",
    emoji: "🚑",
    ocid: "sos.ambulance_button",
    color: "bg-orange-500",
    description: "Free Ambulance Service",
  },
  {
    label: "Women's Helpline",
    number: "181",
    emoji: "👩",
    ocid: "sos.helpline_button",
    color: "bg-primary",
    description: "Tamil Nadu Women's Helpline",
  },
];

export function SOSPage() {
  const { isLoginSuccess, identity, login } = useInternetIdentity();
  const isLoggedIn = isLoginSuccess && !!identity;
  const { isActive, speak } = useVoiceAssistant();

  const { data: contacts, isLoading } = useContacts();
  const addContactMutation = useAddContact();

  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");

  useEffect(() => {
    if (isActive) {
      speak(
        "SOS Emergency page. You can tap to call Police on 100, Ambulance on 108, or Women's Helpline on 181. You can also add your personal emergency contacts.",
      );
    }
  }, [isActive, speak]);

  const handleAddContact = async () => {
    if (!name.trim() || !phone.trim() || !relation.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      await addContactMutation.mutateAsync({ name, phone, relation });
      toast.success(`${name} added to emergency contacts!`);
      setName("");
      setPhone("");
      setRelation("");
      setAddOpen(false);
    } catch {
      toast.error("Failed to add contact. Please try again.");
    }
  };

  return (
    <div className="px-4 py-4 max-w-lg mx-auto space-y-5 animate-fade-in">
      {/* SOS Alert Banner */}
      <div className="bg-destructive/10 border-2 border-destructive/30 rounded-2xl p-4 text-center">
        <div className="text-4xl mb-2">🆘</div>
        <h2 className="font-display text-xl font-bold text-destructive">
          Emergency Contacts
        </h2>
        <p className="text-sm text-destructive/80 mt-1">
          Tap any button below to call immediately
        </p>
      </div>

      {/* Primary Emergency Buttons */}
      <section className="space-y-3">
        {DEFAULT_CONTACTS.map(
          ({ label, number, emoji, ocid, color, description }) => (
            <a
              key={number}
              href={`tel:${number}`}
              data-ocid={ocid}
              className={`flex items-center justify-between p-4 rounded-2xl text-white ${color} shadow-lg hover:opacity-90 active:scale-[0.98] transition-all block no-underline ${label === "Police" ? "sos-pulse" : ""}`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{emoji}</span>
                <div>
                  <p className="font-bold text-lg leading-none">{label}</p>
                  <p className="text-white/80 text-xs mt-0.5">{description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-2xl">{number}</span>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Phone className="h-5 w-5" />
                </div>
              </div>
            </a>
          ),
        )}
      </section>

      {/* Personal Emergency Contacts */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-base font-semibold text-foreground">
            My Emergency Contacts
          </h3>
          {isLoggedIn && (
            <Button
              size="sm"
              onClick={() => setAddOpen(true)}
              className="rounded-full gap-1.5 text-xs"
              data-ocid="sos.add_contact_button"
            >
              <Plus className="h-3 w-3" />
              Add Contact
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        ) : !isLoggedIn ? (
          <Card
            className="border-primary/20 bg-primary/5"
            data-ocid="sos.login_prompt"
          >
            <CardContent className="py-4 text-center space-y-3">
              <AlertCircle className="h-8 w-8 text-primary mx-auto" />
              <p className="text-sm text-foreground font-medium">
                Sign in to save personal emergency contacts
              </p>
              <p className="text-xs text-muted-foreground">
                Add your family members' phone numbers for quick access during
                emergencies.
              </p>
              <Button size="sm" onClick={login} className="rounded-full">
                Sign In
              </Button>
            </CardContent>
          </Card>
        ) : contacts && contacts.length > 0 ? (
          <div className="space-y-2">
            {contacts.map((contact, index) => (
              <Card
                key={contact.id.toString()}
                className="border-border shadow-sm"
                data-ocid={`sos.contact.item.${index + 1}`}
              >
                <CardContent className="py-3 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/15 rounded-full flex items-center justify-center">
                      <span className="text-base">👤</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {contact.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {contact.relation} • {contact.phone}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`tel:${contact.phone}`}
                    data-ocid={`sos.contact.call_button.${index + 1}`}
                    className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-2 rounded-full text-xs font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Phone className="h-3 w-3" />
                    Call
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card
            className="border-dashed border-2 border-primary/25"
            data-ocid="sos.contacts.empty_state"
          >
            <CardContent className="py-6 text-center space-y-2">
              <span className="text-3xl">📱</span>
              <p className="text-sm font-medium text-foreground">
                No contacts added yet
              </p>
              <p className="text-xs text-muted-foreground">
                Add your family and friends for quick emergency calls
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Safety Tips */}
      <Card className="border-primary/20 bg-accent shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            🛡️ Safety Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li>• Share your location with trusted contacts regularly</li>
            <li>• Keep your phone charged when going out</li>
            <li>• Note the nearest police station address</li>
            <li>• Save emergency numbers in speed dial</li>
            <li>• If unsafe, shout "FIRE" — it attracts more attention</li>
          </ul>
        </CardContent>
      </Card>

      {/* Add Contact Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent
          className="max-w-sm rounded-2xl"
          data-ocid="sos.add_contact.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-lg text-primary">
              Add Emergency Contact
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div className="space-y-1.5">
              <Label htmlFor="contact-name" className="text-sm">
                Full Name
              </Label>
              <Input
                id="contact-name"
                placeholder="e.g., Priya (Mother)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl"
                data-ocid="sos.contact_name_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact-phone" className="text-sm">
                Phone Number
              </Label>
              <Input
                id="contact-phone"
                type="tel"
                placeholder="e.g., 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-xl"
                data-ocid="sos.contact_phone_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact-relation" className="text-sm">
                Relation
              </Label>
              <Input
                id="contact-relation"
                placeholder="e.g., Mother, Father, Sister"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="rounded-xl"
                data-ocid="sos.contact_relation_input"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 flex-row">
            <Button
              variant="outline"
              onClick={() => setAddOpen(false)}
              className="flex-1 rounded-xl gap-1"
              data-ocid="sos.add_contact.cancel_button"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleAddContact}
              disabled={addContactMutation.isPending}
              className="flex-1 rounded-xl gap-1"
              data-ocid="sos.contact_submit_button"
            >
              {addContactMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
