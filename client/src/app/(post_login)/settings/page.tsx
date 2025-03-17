import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col mx-auto">
      <div className="w-[400px] px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
        <form className="max-w-md">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <Input type="text" id="name" name="name" defaultValue="John Doe" className="mt-1" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input type="email" id="email" name="email" defaultValue="john@example.com" className="mt-1" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <Input type="password" id="password" name="password" className="mt-1" />
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </div>
    </div>
  )
}

