import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar, FileText, Star, Zap } from 'lucide-react';

export default function DashboardPage() {
  const recentMeetings = [
    {
      id: 1,
      title: 'Tue, Jul 8, 2025',
      date: '7/8/2025',
      type: 'Retrospective',
      items: 4,
      participants: [
        { name: 'User 1', avatar: '/placeholder.svg?height=32&width=32' },
        { name: 'User 2', avatar: '/placeholder.svg?height=32&width=32' },
        { name: 'User 3', avatar: '/placeholder.svg?height=32&width=32' },
      ],
    },
    {
      id: 2,
      title: 'Thu, Jun 26, 2025',
      date: '6/26/2025',
      type: 'Retrospective',
      items: 0,
      participants: [{ name: 'Kane', avatar: '/placeholder.svg?height=32&width=32' }],
    },
  ];

  return (
    <div className="p-4 w-full">
      {/* Start a Meeting Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Start a Meeting</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="py-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-lg">Retrospective</h3>
                  <p className="text-sm text-gray-600">Start a new Retrospective meeting</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="py-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-lg">Planning Poker</h3>
                  <p className="text-sm text-gray-600">Start a new Planning Poker meeting</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Meetings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Your Recent Meetings</h2>
            <p className="text-sm text-gray-600">
              Meetings that you have either created or joined recently
            </p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">CREATE NEW MEETING</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentMeetings.map((meeting) => (
            <Card key={meeting.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={meeting.participants[0]?.avatar || '/placeholder.svg'} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{meeting.title}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">{meeting.date}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="text-xs">
                    <FileText className="h-3 w-3 mr-1" />
                    {meeting.type}
                  </Badge>
                  <span className="text-xs text-gray-500">{meeting.items} items</span>
                </div>
                <div className="flex items-center gap-1">
                  {meeting.participants.map((participant, index) => (
                    <Avatar key={index} className="h-6 w-6">
                      <AvatarImage src={participant.avatar || '/placeholder.svg'} />
                      <AvatarFallback>{participant.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Empty state card */}
          <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
            <CardContent className="p-6 text-center">
              <div className="text-gray-400 mb-2">
                <Calendar className="h-8 w-8 mx-auto" />
              </div>
              <p className="text-sm text-gray-500 mb-2">Kollabe</p>
              <p className="text-xs text-gray-400">Wed Jul 09 2025</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
