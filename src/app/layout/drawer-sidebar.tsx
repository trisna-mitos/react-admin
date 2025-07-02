// ... existing imports ...
import { Button } from "@heroui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@heroui/drawer";
import { useDisclosure } from "@heroui/use-disclosure";
import { Icon } from "@iconify/react";

// ... delete MailIcon and LockIcon components ...

export type DrawerSidebarProps = {
  tittle: string;
  content:string;
  user?: {
    name: string;
    email: string;
  },
  setContent?: (a:number) => Promise<number>;
};

const a : DrawerSidebarProps  = {
  tittle: "a",
  content: "a",
  setContent: async(a) => {
    return a +11;
  }
}

if (a.setContent) {
  const b = await Promise.all([a.setContent(1), a.setContent(2), a.setContent(3)])
  console.log([...b, await a.setContent(4)])
} else {
  console.log("setContent is undefined, cannot execute.")
}

export default function DrawerSidebar({tittle}: DrawerSidebarProps) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      <Button
        onPress={onOpen}
        className="fixed top-4 left-4 z-50"
        isIconOnly
        aria-label="Menu"
      >
        <Icon icon="lucide:menu" className="text-2xl" />
      </Button>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="left">
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">{tittle}</DrawerHeader>
              <DrawerBody>
                <div className="flex flex-col gap-4">
                  <Button
                    startContent={<Icon icon="lucide:home" />}
                    variant="light"
                    className="justify-start"
                    onPress={onClose}
                  >
                    Home
                  </Button>
                  <Button
                    startContent={<Icon icon="lucide:user" />}
                    variant="light"
                    className="justify-start"
                    onPress={onClose}
                  >
                    Profile
                  </Button>
                  <Button
                    startContent={<Icon icon="lucide:settings" />}
                    variant="light"
                    className="justify-start"
                    onPress={onClose}
                  >
                    Settings
                  </Button>
                  <Button
                    startContent={<Icon icon="lucide:help-circle" />}
                    variant="light"
                    className="justify-start"
                    onPress={onClose}
                  >
                    Help
                  </Button>
                </div>
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose} fullWidth>
                  Close
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}